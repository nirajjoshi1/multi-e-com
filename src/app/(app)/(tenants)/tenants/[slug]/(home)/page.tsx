import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { ProductListView } from "@/modules/products/ui/views/product-list-views";
import { loadProductFilter } from "@/modules/products/searchParams";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";


interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
export const dynamic = "force-dynamic";


const Page = async ({ searchParams, params }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilter(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
};

export default Page;