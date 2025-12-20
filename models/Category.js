export const categories = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    createdAt: new Date("2025-01-01"),
  },
  { id: 3, name: "Sports", slug: "sports", createdAt: new Date("2025-01-01") },
  {
    id: 4,
    name: "Science",
    slug: "science",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 5,
    name: "Environment",
    slug: "environment",
    createdAt: new Date("2025-01-01"),
  },
  { id: 6, name: "Health", slug: "health", createdAt: new Date("2025-01-01") },
];

let categoryIdCounter = 7;

export const createCategory = (name) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const newCategory = {
    id: categoryIdCounter++,
    name,
    slug,
    createdAt: new Date(),
  };
  categories.push(newCategory);
  return newCategory;
};

export const deleteCategory = (id) => {
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories.splice(index, 1);
    return true;
  }
  return false;
};

export const findCategoryByName = (name) => {
  return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
};

export default {
  categories,
  createCategory,
  deleteCategory,
  findCategoryByName,
};
