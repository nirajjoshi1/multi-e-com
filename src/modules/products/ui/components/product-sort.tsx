"use client";


import { cn } from "@/lib/utils";
import { useProductFilters } from "../../hooks/use-product-filter";
import { Button } from "@/components/ui/button";

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  return (
    <div className="flex items-center gap-2">
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort === "curated" &&
            "bg-transparent text-primary border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort === "trending" &&
            "bg-transparent text-primary border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort === "hot_and_new" &&
            "bg-transparent text-primary border-transparent hover:border-border hover:bg-transparent"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        Hot & new
      </Button>
    </div>
  );
};
