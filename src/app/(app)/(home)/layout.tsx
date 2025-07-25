import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate,HydrationBoundary } from "@tanstack/react-query";
import { Footer } from "@/modules/home/ui/components/footer";
import {Navbar} from "@/modules/home/ui/components/navbar";
import { SearchFilterLoading, SearchFilters } from "../../../modules/home/ui/components/search-filter";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient(); 

  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions( )
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFilterLoading/>}>

      <SearchFilters/>
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;