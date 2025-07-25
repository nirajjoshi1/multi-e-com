"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { useParams } from "next/navigation";
import BreadcrumbNavigation from "./breadcrumb-navigation";
import { useProductFilters } from "@/modules/products/hooks/use-product-filter";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useProductFilters();

  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const params = useParams();

  const categoryParam = (params.category as string) || undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryColor = activeCategoryData?.color || "#f5f5f5";
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubCategory = (params.subcategory as string) || undefined;
  const activeSubCategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubCategory
    )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput
        defaultValue={filters.search}
        onChange={(value) =>
          setFilters({
            search: value,
          })
        }
      />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  );
};

export const SearchFilterLoading = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
