"use client";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
}

export const SubCategoryMenu = ({ category, isOpen }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5";

  return (
    <div
      className="absolute z-10" // z-10 to ensure it appears above other elements
      style={{
        top: "calc(100% + 0.75rem)", // Position below the button with a small gap (matches the h-3 bridge)
        left: "50%", // Center the dropdown relative to the button
        transform: "translateX(-50%)", // Center-align the dropdown
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-3 w-full" />

      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]"
      >
        <div>
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};