import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { tenansRouter } from "@/modules/tenants/server/procedures";
import { checkoutRouter } from "@/modules/checkout/server/procedures";
import { libraryRouter } from "@/modules/library/server/procedures";
import { reviewsRouter } from "@/modules/reviews/server/procedures";


export const appRouter = createTRPCRouter({
   auth:authRouter,
   products:productsRouter,
   tags:tagsRouter,
   checkout:checkoutRouter,
   library:libraryRouter,
   reviews:reviewsRouter,
   tenants:tenansRouter,
   categories: categoriesRouter,

});
// export type definition of API
export type AppRouter = typeof appRouter;