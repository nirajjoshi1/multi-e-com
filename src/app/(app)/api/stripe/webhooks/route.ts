
import type {Stripe} from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

import {stripe} from "@/lib/stripe";
import { ExpandedLineItems } from "@/modules/checkout/types";

export async function POST(req:Request){
    let event :Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
          await (await req.blob()).text(),
          req.headers.get("stripe-signature") as string,
          process.env.STRIPE_WEBHOOK_SECRET! as string,
        );
    } catch (err) {
        const errMessage = err instanceof Error ? err.message :" Unknown Errro!";

        if(err ! instanceof Error){
            console.log(err)
        };
        console.log("❌ Error",errMessage);

       return NextResponse.json(
        {message:`Webhook error: ${errMessage }`},
        {status:400}
    ) 
    };

    console.log("✅ Success",event.id);

    const permittedEvents : string[] = [
        "checkout.session.completed", 
        "account.updated"
    ]; 

    const payload = await getPayload({config});

    if(permittedEvents.includes(event.type)){
        let data; 
        try {
            switch(event.type){
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;

                    if(!data.metadata?.userId){
                        throw new Error("User id is required");
                    };

                    const user = await payload.findByID({
                        collection:"users",
                        id:data.metadata.userId,
                    });

                    if(!user){
                        throw new Error("User not found");
                    };

                    const expandedSession = await stripe.checkout.sessions.retrieve(
                        data.id,
                        {
                            expand:["line_items.data.price.product"],
                        },
                        {
                            stripeAccount:event.account,
                        }
                    );

                    if(
                        !expandedSession.line_items?.data || 
                        !expandedSession.line_items.data.length
                    ){
                        throw new Error("No line items found");
                    };

                    const lineItems = expandedSession.line_items
                      .data as ExpandedLineItems[];

                      for(const item of lineItems){
                        await payload.create({
                            collection:"orders",
                            data:{
                                stripeCheckoutSessionId: data.id,
                                stripeAccountId:event.account,
                                user:user.id,
                                product:item.price.product.metadata.id,
                                name:item.price.product.name,
                            },
                        });
                      }
                      break;
                      case"account.updated":
                      data = event.data.object as Stripe.Account;

                      await payload.update({
                        collection:"tenants",
                        where:{
                            stripeAccountId:{
                                equals:data.id,
                            },
                        },
                        data:{
                            stripeDetailsSubmitted:data.details_submitted,
                        },
                      });
                      break;
                      default: 
                      throw new Error(`Unhandled evevnt: ${event.type}`);
            };
        } catch (error) {
            console.log(error);
            return NextResponse.json(
                {message:"Webhookhandler failed!"},
                {status:500},
        );
        };
    };

    return NextResponse.json({message:"Received"},{status:200})
};