import { getPayload } from "payload";
import config from "@payload-config";
import { stripe } from "./lib/stripe";

const categories = [
  {
    name: "All",
    slug: "all",
    color: "#F5F5F5",
  },
  {
    name: "Business & Money",
    color: "#2A4D69",
    slug: "business-money",
    subcategories: [
      { name: "Accounting", slug: "accounting" },
      { name: "Entrepreneurship", slug: "entrepreneurship" },
      { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
      { name: "Investing", slug: "investing" },
      { name: "Management & Leadership", slug: "management-leadership" },
      { name: "Marketing & Sales", slug: "marketing-sales" },
      { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
      { name: "Personal Finance", slug: "personal-finance" },
      { name: "Real Estate", slug: "real-estate" },
    ],
  },
  {
    name: "Software Development",
    color: "#1E88E5",
    slug: "software-development",
    subcategories: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Development", slug: "mobile-development" },
      { name: "Game Development", slug: "game-development" },
      { name: "Programming Languages", slug: "programming-languages" },
      { name: "DevOps", slug: "devops" },
    ],
  },
  {
    name: "Writing & Publishing",
    color: "#6A1B9A",
    slug: "writing-publishing",
    subcategories: [
      { name: "Fiction", slug: "fiction" },
      { name: "Non-Fiction", slug: "non-fiction" },
      { name: "Blogging", slug: "blogging" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Self-Publishing", slug: "self-publishing" },
    ],
  },
  {
    name: "Other",
    slug: "other",
    color: "#B0BEC5",
  },
  {
    name: "Education",
    color: "#FBC02D",
    slug: "education",
    subcategories: [
      { name: "Online Courses", slug: "online-courses" },
      { name: "Tutoring", slug: "tutoring" },
      { name: "Test Preparation", slug: "test-preparation" },
      { name: "Language Learning", slug: "language-learning" },
    ],
  },
  {
    name: "Self Improvement",
    color: "#4CAF50",
    slug: "self-improvement",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Personal Development", slug: "personal-development" },
      { name: "Mindfulness", slug: "mindfulness" },
      { name: "Career Growth", slug: "career-growth" },
    ],
  },
  {
    name: "Fitness & Health",
    color: "#E53935",
    slug: "fitness-health",
    subcategories: [
      { name: "Workout Plans", slug: "workout-plans" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Mental Health", slug: "mental-health" },
      { name: "Yoga", slug: "yoga" },
    ],
  },
  {
    name: "Design",
    color: "#7B1FA2",
    slug: "design",
    subcategories: [
      { name: "UI/UX", slug: "ui-ux" },
      { name: "Graphic Design", slug: "graphic-design" },
      { name: "3D Modeling", slug: "3d-modeling" },
      { name: "Typography", slug: "typography" },
    ],
  },
  {
    name: "Drawing & Painting",
    color: "#FF7043",
    slug: "drawing-painting",
    subcategories: [
      { name: "Watercolor", slug: "watercolor" },
      { name: "Acrylic", slug: "acrylic" },
      { name: "Oil", slug: "oil" },
      { name: "Pastel", slug: "pastel" },
      { name: "Charcoal", slug: "charcoal" },
    ],
  },
  {
    name: "Music",
    color: "#D81B60",
    slug: "music",
    subcategories: [
      { name: "Songwriting", slug: "songwriting" },
      { name: "Music Production", slug: "music-production" },
      { name: "Music Theory", slug: "music-theory" },
      { name: "Music History", slug: "music-history" },
    ],
  },
  {
    name: "Photography",
    color: "#455A64",
    slug: "photography",
    subcategories: [
      { name: "Portrait", slug: "portrait" },
      { name: "Landscape", slug: "landscape" },
      { name: "Street Photography", slug: "street-photography" },
      { name: "Nature", slug: "nature" },
      { name: "Macro", slug: "macro" },
    ],
  },
];

// Function to normalize slugs
const normalizeSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/&/g, "and") // Replace & with "and"
    .replace(/[^a-z0-9-]/g, ""); // Remove any other special characters

const seed = async () => {
  const payload = await getPayload({ config });

  const adminAccount = await stripe.accounts.create({});

  const adminTenant = await payload.create({
    collection:"tenants",
    data:{
      name:"admin",
      slug:"admin",
      stripeAccountId: adminAccount.id,
    },
  });

  //?create admin user

  await payload.create({
    collection:"users",
    data:{
      email:"admin@demo.com",
      password:"demo",
      roles:["super-admin"],
      username:"admin",
      tenants:[
        {
          tenant:adminTenant.id
        }
      ]
    }
  })

  // Clear existing categories to avoid duplicate slug errors
  console.log("Clearing existing categories...");
  await payload.delete({
    collection: "categories",
    where: {}, // Deletes all documents in the collection
  });

  // Keep track of used slugs to ensure uniqueness
  const usedSlugs = new Set<string>();

  for (const category of categories) {
    const normalizedParentSlug = normalizeSlug(category.slug);

    // Check for duplicate slugs
    if (usedSlugs.has(normalizedParentSlug)) {
      throw new Error(
        `Duplicate slug detected for parent category: ${normalizedParentSlug}`
      );
    }
    usedSlugs.add(normalizedParentSlug);

    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: normalizedParentSlug,
        color: category.color,
        parent: null,
      },
    });

    for (const subCategory of category.subcategories || []) {
      // Normalize subcategory slug, and prefix with parent slug to ensure uniqueness
      const normalizedSubCategorySlug = normalizeSlug(subCategory.name);
      const uniqueSubCategorySlug = `${normalizedParentSlug}-${normalizedSubCategorySlug}`;

      // Check for duplicate slugs
      if (usedSlugs.has(uniqueSubCategorySlug)) {
        throw new Error(
          `Duplicate slug detected for subcategory: ${uniqueSubCategorySlug}`
        );
      }
      usedSlugs.add(uniqueSubCategorySlug);

      await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: uniqueSubCategorySlug, // Use unique slug
          parent: parentCategory.id,
        },
      });
    }
  }
};

try {
  await seed();
  console.log("Seeding completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("Error while seeding!", error);
  process.exit(1);
}
