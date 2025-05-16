import type { User } from "payload";
import { ClientUser } from "payload";


export const isSuperAdmin = (user:User|ClientUser|null)=>{
    return Boolean(user?.roles?.includes("super-admin"));
}