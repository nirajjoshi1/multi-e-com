import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTenantUrl(tenantSlug:string){
  const isDevelopment = process.env.NODE_ENV==="development";
  const isSubDomainRoutingEnabled=process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING==="true";
  if(isDevelopment||!isSubDomainRoutingEnabled){
    return `${process.env.NEXT_PUBLIC_URL}/tenants/${tenantSlug}`;
  };
  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
  return `${protocol}://${tenantSlug}.${domain}`

} 

export function formatCurrency(value:number|string){
 return new Intl.NumberFormat("en-US", {
       style: "currency", 
       currency: "USD",
       maximumFractionDigits: 0,
     }).format(Number(value));
   
}