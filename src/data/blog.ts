import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogPost {
  title: string;
  description: string;
  path: string;
  date: string;
  author: string;
  tags: string[];
  relatedTools: string[];
}

function getEntriesFromDirectory(dirPath: string) {
  const absolutePath = path.resolve(dirPath);
  if (!fs.existsSync(absolutePath)) return [];
  const files = fs.readdirSync(absolutePath);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(absolutePath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      return { slug, data, body: content.trim() };
    });
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
