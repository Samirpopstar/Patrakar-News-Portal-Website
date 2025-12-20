export const articles = [
  {
    id: 1,
    title: "Artificial Intelligence",
    slug: "ai-transforms-healthcare",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. ",
    category: "Technology",
    author: "Admin",
    date: new Date("2025-11-5"),
    image: "/uploads/tech.jpeg",
    featured: true,
    views: 10,
  },
  {
    id: 2,
    title: "Renewable Energy News",
    slug: "renewable-energy-milestone",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.",
    category: "Environment",
    author: "Admin",
    date: new Date("2025-11-6"),
    image: "/uploads/tech.jpeg",
    featured: true,
    views: 980,
  },
  {
    id: 3,
    title: "Olympic Champion News",
    slug: "olympic-world-record",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. ",
    category: "Sports",
    author: "Admin",
    date: new Date("2025-11-6"),
    image: "/uploads/tech.jpeg",
    featured: false,
    views: 756,
  },
  {
    id: 4,
    title: "Space News",
    slug: "mars-colony-timeline",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos",
    excerpt: "Lorem ipsum dolor sit amet consectetur adipiscing elit. ",
    category: "Science",
    author: "Admin",
    date: new Date("2025-11-7"),
    image: "/uploads/tech.jpeg",
    featured: false,
    views: 2100,
  },
  {
    id: 5,
    title: "Global Markets News",
    slug: "markets-rally-economic-recovery",
    content:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mis.",
    category: "Business",
    author: "Admin",
    date: new Date("2025-11-8"),
    image: "/uploads/tech.jpeg",
    featured: false,
    views: 543,
  },
];

let articleIdCounter = 6;

export const createArticle = (articleData) => {
  const newArticle = {
    id: articleIdCounter++,
    ...articleData,
    date: new Date(),
    views: 0,
  };
  articles.push(newArticle);
  return newArticle;
};

export const updateArticle = (id, articleData) => {
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...articleData,
    };
    return articles[index];
  }
  return null;
};

export const deleteArticle = (id) => {
  const index = articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    articles.splice(index, 1);
    return true;
  }
  return false;
};

export default { articles, createArticle, updateArticle, deleteArticle };
