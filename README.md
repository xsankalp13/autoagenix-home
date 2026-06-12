# AutoAgenix

Privacy-first browser-based tools for founders, developers, and creators. All operations occur client-side in the browser. Zero server uploads, zero tracking, and absolute privacy.

## 🚀 Architecture & Technical Design

AutoAgenix is built with a registry-first architecture using Astro. To minimize maintenance overhead, ensure absolute SEO correctness, and support instant scalability, the codebase uses a single source of truth registry for its configuration.

### 📋 Central Registry

- **Location:** `src/data/tools.ts`
- **Purpose:** Declares all categories, tools, metadata, badges, and FAQs.
- **Workflow:** When a developer wants to add a tool, they define its configuration in `tools.ts`. The platform automatically builds all pages, routing paths, navigation menus, sitemaps, and machine-readable assets from this registry.

---

## 🤖 AI Crawler Discoverability & llms.txt

To ensure seamless discoverability by LLMs (e.g., ChatGPT, Claude, Gemini, Perplexity) and automated AI agents, AutoAgenix implements the `llms.txt` community standard.

### 📁 Discoverability Files

1. **`public/llms.txt`**: A high-level, human-and-machine-readable Markdown index containing:
   - What AutoAgenix is
   - Active categories
   - Featured tools
   - References to the blog and legal pages
   - A link pointing to the full manifest file (`llms-full.txt`)
2. **`public/llms-full.txt`**: A comprehensive, detailed manifest containing:
   - Full tool inventory grouped by category with complete descriptions
   - Full list of blog articles automatically discovered and parsed
   - Links to all platform pages

### ⚙️ How Future Tools Are Automatically Included

Both `llms.txt` and `llms-full.txt` are **automatically generated during build/development initialization**.
- **Astro Integration:** A custom build hook (`generate-llms-files`) in `astro.config.mjs` runs on `astro:config:setup`.
- **Blog Auto-Discovery:** The script scans `src/pages/blog/*.astro` (excluding the index page), extracts the title and description via AST/regex parsing, and appends them to the blog inventory list.
- **Registry Mapping:** The script imports the `tools` and `categories` registries from `src/data/tools.ts`. It maps, filters (e.g., for `featured` flags), and groups them to build the exact Markdown output structure.
- **Outcome:** A developer never needs to update AI discoverability assets manually. Adding a new tool to `src/data/tools.ts` or creating a new blog post in `src/pages/blog/` will automatically update the files in the next build/dev session.

### 🔍 Discovery Channels

AI crawlers automatically find these resources through multiple entry points:
- **`public/robots.txt`**: Contains an `Info` reference:
  ```text
  # AI discoverability
  Info: https://autoagenix.com/llms.txt
  ```
- **Site Footer (`src/components/Footer.astro`)**: Includes a dedicated, low-profile `llms.txt` link in the legal section.

---

## 🧞 Development Commands

All commands are run from the root of the project:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server at `localhost:4321` (also runs LLM generator) |
| `npm run build` | Builds your production static site to `./dist/` |
| `npm run preview` | Previews the build output locally |
