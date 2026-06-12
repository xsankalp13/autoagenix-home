export type Category = 'startup' | 'privacy' | 'developer';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPostLink {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
}

export interface Tool {
  id: string;
  name: string;
  title?: string;
  description: string;
  shortDescription?: string;
  category: Category;
  path: string;
  icon?: string;
  featured?: boolean;
  badge?: string;
  howItWorks?: string;
  benefits?: string[];
  useCases?: string[];
  faq?: FAQItem[];
  faqs?: FAQItem[];
  relatedTools?: string[];
  keywords?: string[];
  relatedArticles?: BlogPostLink[];
}

const allContentFiles = import.meta.glob('/src/content/**/*.md', { eager: true });

function getEntriesFromDirectory(dirPath: string) {
  const prefix = `/${dirPath}/`;
  const entries = [];
  for (const [filePath, module] of Object.entries(allContentFiles)) {
    if (filePath.startsWith(prefix)) {
      const slug = filePath.slice(prefix.length, -3); // remove prefix and .md
      const data = (module as any).frontmatter || {};
      const body = (module as any).rawContent ? (module as any).rawContent() : '';
      entries.push({ slug, data, body });
    }
  }
  return entries;
}

// 1. Load blog posts
const blogEntries = getEntriesFromDirectory('src/content/blog');
const blogPosts = blogEntries.map(entry => ({
  slug: entry.slug,
  title: entry.data.title,
  description: entry.data.description,
  path: `/blog/${entry.slug}`,
  date: entry.data.date instanceof Date ? entry.data.date.toISOString() : entry.data.date,
  author: entry.data.author,
  tags: entry.data.tags || [],
  relatedTools: entry.data.relatedTools || [],
}));

// 2. Load categories
const catEntries = getEntriesFromDirectory('src/content/categories');
export const categories: { id: Category; name: string; description: string }[] = catEntries.map(entry => ({
  id: entry.slug as Category,
  name: entry.data.name,
  description: entry.data.description,
}));

// 3. Load tools and resolve relations
const toolEntries = getEntriesFromDirectory('src/content/tools');
export const tools: Tool[] = toolEntries.map(entry => {
  const faqItems = entry.data.faq || [];
  
  const explicitArticleSlugs = entry.data.relatedArticles || [];
  const matchedArticles = blogPosts.filter(post => {
    const isExplicit = explicitArticleSlugs.includes(post.slug);
    const referencesTool = post.relatedTools.includes(entry.slug);
    const matchesCategory = post.tags.includes(entry.data.category);
    return isExplicit || referencesTool || matchesCategory;
  });

  const uniqueArticlesMap = new Map<string, BlogPostLink>();
  matchedArticles.forEach(post => {
    uniqueArticlesMap.set(post.slug, {
      title: post.title,
      description: post.description,
      path: post.path,
      date: post.date,
      author: post.author,
    });
  });
  const relatedArticles = Array.from(uniqueArticlesMap.values());

  return {
    id: entry.slug,
    name: entry.data.name,
    title: entry.data.title,
    description: entry.data.description,
    shortDescription: entry.data.shortDescription,
    category: entry.data.category as Category,
    path: `/${entry.data.category}/${entry.slug}`,
    featured: entry.data.featured || false,
    badge: entry.data.badge,
    howItWorks: entry.data.howItWorks,
    benefits: entry.data.benefits || [],
    useCases: entry.data.useCases || [],
    faq: faqItems,
    faqs: faqItems,
    relatedTools: entry.data.relatedTools || [],
    keywords: entry.data.keywords || [],
    relatedArticles,
  };
});

export const getToolsByCategory = (category: Category) => tools.filter(t => t.category === category);
