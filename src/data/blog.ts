export interface BlogPost {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
  tags: string[];
  relatedTools: string[];
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

// Load blog posts from content collection directory
const blogEntries = getEntriesFromDirectory('src/content/blog');
export const blogPosts: BlogPost[] = blogEntries.map(entry => ({
  title: entry.data.title,
  description: entry.data.description,
  path: `/blog/${entry.slug}`,
  date: entry.data.date instanceof Date ? entry.data.date.toISOString() : entry.data.date,
  author: entry.data.author,
  tags: entry.data.tags || [],
  relatedTools: entry.data.relatedTools || [],
}));

export const getRelevantBlogPosts = (toolCategory: string, toolKeywords: string[] = []): BlogPost[] => {
  return blogPosts.filter(post => {
    // 1. Check if category matches any post tag
    const categoryMatch = post.tags.includes(toolCategory);
    
    // 2. Check if any tool keyword matches post tags
    const keywordMatch = toolKeywords.some(keyword => 
      post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    // 3. General catch-all (like our philosophy post)
    const isLocalFirst = post.title.includes("Local-First");
    
    return categoryMatch || keywordMatch || isLocalFirst;
  });
};
