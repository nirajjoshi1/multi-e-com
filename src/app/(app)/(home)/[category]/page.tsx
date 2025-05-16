import {SearchParams} from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductFilter } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-views";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}
export const dynamic = "force-dynamic";


const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilter(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      category,
      limit:DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};

export default Page;
