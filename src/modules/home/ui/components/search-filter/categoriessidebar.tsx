"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export const CategoriesSidebar = ({
  open,
  onOpenChangeAction,
}: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const [viewingSubcategories, setViewingSubcategories] = useState<{
    parentCategory: CategoriesGetManyOutput[1];
    subcategories: CategoriesGetManyOutput;
  } | null>(null);

  const currentCategories = viewingSubcategories?.subcategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setViewingSubcategories(null);
    onOpenChangeAction(open);
  };
 
  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      // Show subcategories
      setViewingSubcategories({
        parentCategory: category,
        subcategories: category.subcategories as CategoriesGetManyOutput,
      });
    } else {
      // Navigate to category/subcategory
      if (viewingSubcategories) {
        // This is a subcategory click
        router.push(`/${viewingSubcategories.parentCategory.slug}/${category.slug}`);
      } else {
        // This is a main category click
        if (category.slug === "all") {
          router.push("/");
        } else {  
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    setViewingSubcategories(null);
  };

  // Add "All" category to the main categories if not present
  const categoriesWithAll = data && !data.find(cat => cat.slug === "all") 
    ? [{ id: "all", name: "All", slug: "all", color: "#F5F5F5", subcategories: [], updatedAt: "", createdAt: "" }, ...data]
    : data || [];

  const displayCategories = viewingSubcategories?.subcategories ?? categoriesWithAll;
  const backgroundColor = viewingSubcategories?.parentCategory?.color || "white";
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none "
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>
            {viewingSubcategories 
              ? viewingSubcategories.parentCategory.name 
              : "Categories"
            }
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {viewingSubcategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 cursor-pointer hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2 " />
              Back
            </button>
          )}
          {displayCategories.map((category) => (
            <button
              onClick={() => handleCategoryClick(category)}
              key={category.slug}
              className="w-full text-left p-4 hover:bg-black hover:text-white cursor-pointer flex justify-between items-center text-base font-medium"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4 " />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
