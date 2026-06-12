import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { categories, tools } from './src/data/tools.ts';

export default defineConfig({
  site: 'https://autoagenix.com',
  integrations: [
    tailwind(),
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const segments = url.pathname.split('/').filter(Boolean);
        const categoryIds = categories.map(c => c.id);

        // Exclude error pages from sitemap
        if (segments.length === 1 && ['404', '500', '403'].includes(segments[0])) {
          return undefined;
        }

        if (segments.length === 0) {
          // Homepage
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (segments[0] === 'blog') {
          // Blog Pages (Blog List & Blog Posts)
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (segments[0] === 'privacy-policy' || segments[0] === 'terms') {
          // Legal Pages
          item.priority = 0.3;
          item.changefreq = 'yearly';
        } else if (segments[0] === 'about' || segments[0] === 'contact') {
          // Standard Info Pages (About, Contact)
          item.priority = 0.5;
          item.changefreq = 'monthly';
        } else if (segments.length === 1 && categoryIds.includes(segments[0])) {
          // Category Pages
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (segments.length === 2 && categoryIds.includes(segments[0])) {
          // Tool Pages
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }

        return item;
      }
    }),
    {
      name: 'sitemap-postbuild',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const fs = await import('node:fs/promises');
          const path = await import('node:path');
          const { fileURLToPath } = await import('node:url');
          
          const destDir = fileURLToPath(dir);
          const indexFile = path.resolve(destDir, 'sitemap-index.xml');
          const sitemapFile = path.resolve(destDir, 'sitemap.xml');
          
          try {
            await fs.copyFile(indexFile, sitemapFile);
            console.log('Successfully copied sitemap-index.xml to sitemap.xml');
          } catch (err) {
            console.error('Failed to copy sitemap index:', err);
          }
        }
      }
    },
    {
      name: 'generate-llms-files',
      hooks: {
        'astro:config:setup': async () => {
          const fs = await import('node:fs/promises');
          const path = await import('node:path');
          
          try {
            // 1. Fetch Blog Inventory
            const blogDir = path.resolve('src/pages/blog');
            const files = await fs.readdir(blogDir).catch(() => []);
            const blogPosts = [];
            for (const file of files) {
              if (file === 'index.astro' || !file.endsWith('.astro')) continue;
              const filePath = path.join(blogDir, file);
              const content = await fs.readFile(filePath, 'utf-8');
              
              // Extract title and description using regex
              const titleMatch = content.match(/title=["']([^"']+)["']/);
              const descMatch = content.match(/description=["']([^"']+)["']/);
              
              const slug = file.replace(/\.astro$/, '');
              blogPosts.push({
                slug,
                title: titleMatch ? titleMatch[1] : slug,
                description: descMatch ? descMatch[1] : '',
                url: `/blog/${slug}`
              });
            }

            // 2. Generate llms.txt
            const categoryOrder = ['privacy', 'startup', 'developer'];
            const sortedCategories = [...categories].sort((a, b) => categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id));

            const llmsTextLines = [];
            llmsTextLines.push('# AutoAgenix');
            llmsTextLines.push('> Privacy-first browser-based tools.');
            llmsTextLines.push('');
            llmsTextLines.push('This file provides a high-level index of our platform. For a complete inventory of all tools, see the [Full Index](https://autoagenix.com/llms-full.txt).');
            llmsTextLines.push('');
            llmsTextLines.push('## Categories');
            llmsTextLines.push('');
            for (const cat of sortedCategories) {
              const catName = cat.name.endsWith('Tools') ? cat.name : `${cat.name} Tools`;
              llmsTextLines.push(`* [${catName}](https://autoagenix.com/${cat.id})`);
            }
            llmsTextLines.push('');
            llmsTextLines.push('## Featured Tools');
            llmsTextLines.push('');
            const featuredTools = tools
              .filter(t => t.featured)
              .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
            for (const tool of featuredTools) {
              llmsTextLines.push(`* [${tool.name}](https://autoagenix.com${tool.path})`);
            }
            llmsTextLines.push('');
            llmsTextLines.push('## Blog');
            llmsTextLines.push('');
            llmsTextLines.push('* [Blog](https://autoagenix.com/blog)');
            llmsTextLines.push('');
            llmsTextLines.push('## Legal');
            llmsTextLines.push('');
            llmsTextLines.push('Link to:');
            llmsTextLines.push('');
            llmsTextLines.push('* [Privacy Policy](https://autoagenix.com/privacy-policy)');
            llmsTextLines.push('* [Terms of Service](https://autoagenix.com/terms)');
            
            const publicDir = path.resolve('public');
            await fs.mkdir(publicDir, { recursive: true });
            await fs.writeFile(path.join(publicDir, 'llms.txt'), llmsTextLines.join('\n') + '\n');

            // 3. Generate llms-full.txt
            const llmsFullLines = [];
            llmsFullLines.push('# AutoAgenix - Full Index');
            llmsFullLines.push('> Complete inventory of privacy-first browser-based tools, categories, and articles.');
            llmsFullLines.push('');
            llmsFullLines.push('This file contains a detailed list of all resources on AutoAgenix. For a summary, see [llms.txt](https://autoagenix.com/llms.txt).');
            llmsFullLines.push('');
            llmsFullLines.push('## Categories');
            llmsFullLines.push('');
            for (const cat of sortedCategories) {
              const catName = cat.name.endsWith('Tools') ? cat.name : `${cat.name} Tools`;
              llmsFullLines.push(`* [${catName}](https://autoagenix.com/${cat.id}): ${cat.description}`);
            }
            llmsFullLines.push('');
            llmsFullLines.push('## Full Tool Inventory');
            llmsFullLines.push('');
            for (const cat of sortedCategories) {
              const catTools = tools.filter(t => t.category === cat.id);
              llmsFullLines.push(`### ${cat.name} Tools`);
              llmsFullLines.push('');
              if (catTools.length > 0) {
                for (const tool of catTools) {
                  llmsFullLines.push(`* [${tool.name}](https://autoagenix.com${tool.path}): ${tool.description}`);
                }
              } else {
                llmsFullLines.push('*No tools in this category yet.*');
              }
              llmsFullLines.push('');
            }
            llmsFullLines.push('## Blog Inventory');
            llmsFullLines.push('');
            if (blogPosts.length > 0) {
              for (const post of blogPosts) {
                llmsFullLines.push(`* [${post.title}](https://autoagenix.com${post.url}): ${post.description}`);
              }
            } else {
              llmsFullLines.push('*No blog posts available yet.*');
            }
            llmsFullLines.push('');
            llmsFullLines.push('## Legal');
            llmsFullLines.push('');
            llmsFullLines.push('* [Privacy Policy](https://autoagenix.com/privacy-policy): Our privacy practices.');
            llmsFullLines.push('* [Terms of Service](https://autoagenix.com/terms): Our terms and conditions.');
            llmsFullLines.push('');
            llmsFullLines.push('## Architecture & Discoverability');
            llmsFullLines.push('');
            llmsFullLines.push('All tools are registered in a centralized metadata schema at `src/data/tools.ts`. Sitemaps, indexing files, and route schemas are generated directly from this schema. Adding a new tool config dynamically populates it across the site.');
            
            await fs.writeFile(path.join(publicDir, 'llms-full.txt'), llmsFullLines.join('\n') + '\n');
            console.log('Successfully generated llms.txt and llms-full.txt');
          } catch (err) {
            console.error('Failed to generate llms files:', err);
          }
        }
      }
    }
  ],
});

