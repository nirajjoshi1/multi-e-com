
import Link from "next/link";
import {Poppins} from "next/font/google";

import {cn} from "@/lib/utils"

const poppins = Poppins({
    subsets:["latin"],
    weight:["700"]
})

export const Footer = () => {
  return (
    <footer className=" border-t border-t-slate-800 font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex gap-2 h-full px-4 lg:px-12 items-center">
        <p> Powered by </p>
        <Link
          className={cn("text-2xl font-semibold ", poppins.className)}
          href={process.env.NEXT_PUBLIC_URL!}
        >
          <span>funroad</span>
        </Link>
      </div>
    </footer>
  );
};
