import { siteMetadata } from '../../data/siteMetadata';
import { categories, tools } from '../../data/tools';

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export interface OfferSchema {
  "@type": "Offer";
  price: string;
  priceCurrency: string;
}

export interface SoftwareApplicationSchema {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  offers: OfferSchema;
}

export interface FAQQuestionSchema {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FAQQuestionSchema[];
}

export interface ListItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: ListItemSchema[];
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  datePublished: string;
  author: {
    "@type": "Person" | "Organization";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  image?: string;
}

export type SchemaOrgEntity =
  | WebSiteSchema
  | OrganizationSchema
  | SoftwareApplicationSchema
  | FAQPageSchema
  | BreadcrumbListSchema
  | ArticleSchema;

// Helper to construct absolute URLs
function getAbsoluteUrl(path: string, baseUrl: string = siteMetadata.url): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(normalizedPath, baseUrl).toString();
}

// 1. Homepage: WebSite Schema
export function generateWebSiteSchema(options?: {
  name?: string;
  url?: string;
  description?: string;
}): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: options?.name || siteMetadata.name,
    url: options?.url || siteMetadata.url,
    description: options?.description || siteMetadata.defaultDescription,
  };
}

// 2. Homepage: Organization Schema
export function generateOrganizationSchema(options?: {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}): OrganizationSchema {
  const logoPath = options?.logo || '/logo.png';
  const metadataSocials = (siteMetadata as any).socialLinks;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: options?.name || siteMetadata.name,
    url: options?.url || siteMetadata.url,
    logo: getAbsoluteUrl(logoPath, options?.url || siteMetadata.url),
    ...(options?.sameAs || metadataSocials ? {
      sameAs: options?.sameAs || metadataSocials
    } : {}),
  };
}

// 3. Tool: SoftwareApplication Schema
export function generateSoftwareApplicationSchema(options: {
  name: string;
  description: string;
  url: string;
  category?: string;
  operatingSystem?: string;
}): SoftwareApplicationSchema {
  let appCategory = 'UtilityApplication';
  if (options.category === 'privacy') {
    appCategory = 'SecurityApplication';
  } else if (options.category === 'startup') {
    appCategory = 'BusinessApplication';
  } else if (options.category === 'developer') {
    appCategory = 'DeveloperApplication';
  }

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options.name,
    description: options.description,
    applicationCategory: appCategory,
    operatingSystem: options.operatingSystem || 'Any',
    url: options.url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

// 4. Tool: FAQPage Schema
export function generateFAQPageSchema(faqs: { question: string; answer: string }[]): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// 5. BreadcrumbList Schema
export function generateBreadcrumbListSchema(items: { name: string; url: string }[]): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Dynamic Breadcrumb Schema Generator
export function generateBreadcrumbSchemaFromPath(pathname: string, baseUrl: string = siteMetadata.url): BreadcrumbListSchema {
  const cleanPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  const segments = cleanPath.split('/').filter(Boolean);
  
  const items: { name: string; url: string }[] = [];
  
  items.push({ name: 'Home', url: new URL('/', baseUrl).toString() });
  
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    let name = segment;
    
    const matchedCategory = categories.find(c => c.id === segment);
    if (matchedCategory) {
      name = matchedCategory.name;
    } else {
      const matchedTool = tools.find(t => t.id === segment);
      if (matchedTool) {
        name = matchedTool.name;
      } else {
        name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    items.push({
      name,
      url: new URL(currentPath, baseUrl).toString(),
    });
  }
  
  return generateBreadcrumbListSchema(items);
}

// 6. Article Schema (Blog Preparation)
export function generateArticleSchema(options: {
  headline: string;
  description: string;
  datePublished: string;
  authorName: string;
  authorType?: 'Person' | 'Organization';
  imageUrl?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
}): ArticleSchema {
  const pubName = options.publisherName || siteMetadata.name;
  const pubLogo = options.publisherLogoUrl || '/logo.png';

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.headline,
    description: options.description,
    datePublished: options.datePublished,
    author: {
      "@type": options.authorType || 'Organization',
      name: options.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: pubName,
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl(pubLogo),
      },
    },
    ...(options.imageUrl ? { image: getAbsoluteUrl(options.imageUrl) } : {}),
  };
}
