import React, { useEffect } from "react";

interface SEOMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: string;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  category?: string;
}

export const SEOHead: React.FC<SEOMetaProps> = ({
  title = "LuxDeal Quick - Luxury Brands at Unbeatable Prices",
  description = "Discover authentic luxury brands at unprecedented discounts. Designer watches, jewelry, fashion & accessories from top brands like Rolex, Cartier, Hermès.",
  keywords = "luxury brands, designer watches, luxury jewelry, discounted designer, authentic luxury",
  image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630",
  url = "https://luxdeal-quick.replit.app",
  type = "website",
  price,
  currency = "USD",
  availability = "in_stock",
  brand,
  category,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Basic SEO meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Product-specific structured data
    if (type === 'product' && price && brand) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": brand
        },
        "category": category,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "availability": `https://schema.org/${availability === 'in_stock' ? 'InStock' : availability === 'out_of_stock' ? 'OutOfStock' : 'PreOrder'}`,
          "url": url
        }
      };

      // Remove existing product schema
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-product]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new product schema
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-product', 'true');
      script.textContent = JSON.stringify(productSchema);
      document.head.appendChild(script);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

  }, [title, description, keywords, image, url, type, price, currency, availability, brand, category]);

  return null;
};

// Hook for dynamic SEO updates
export const useSEO = (seoData: SEOMetaProps) => {
  useEffect(() => {
    // This will trigger the SEO component to update
    const event = new CustomEvent('seo-update', { detail: seoData });
    window.dispatchEvent(event);
  }, [seoData]);
};

// Sitemap generator utility
export const generateSitemap = (routes: Array<{ path: string; priority?: number; changefreq?: string; lastmod?: string }>) => {
  const baseUrl = "https://luxdeal-quick.replit.app";
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <priority>${route.priority || 0.8}</priority>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
  </url>
`).join('')}
</urlset>`;

  return sitemapXml;
};

// Robots.txt generator
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: https://luxdeal-quick.replit.app/sitemap.xml

# Specific rules for luxury e-commerce
Allow: /products/*
Allow: /category/*
Disallow: /admin*
Disallow: /api/*
Disallow: /*.json$
Disallow: /*?*

# Crawl delay for good server performance
Crawl-delay: 1`;
};

// Analytics and tracking utilities
export const SEOAnalytics = {
  // Track page views for SEO insights
  trackPageView: (path: string, title: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: path,
      });
    }
  },

  // Track product views
  trackProductView: (productId: string, productName: string, category: string, price: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        currency: 'USD',
        value: price,
        items: [{
          item_id: productId,
          item_name: productName,
          category: category,
          price: price,
        }]
      });
    }
  },

  // Track search queries for SEO optimization
  trackSearch: (searchTerm: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    }
  },

  // Track conversion events
  trackPurchase: (orderId: string, orderValue: number, items: Array<{id: string, name: string, category: string, price: number}>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: orderValue,
        currency: 'USD',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category,
          price: item.price,
        }))
      });
    }
  },
};

// Rich snippets generators
export const generateProductRichSnippet = (product: {
  name: string;
  description: string;
  image: string;
  brand: string;
  price: number;
  originalPrice: number;
  category: string;
  availability: 'in_stock' | 'out_of_stock';
  reviews?: { rating: number; count: number };
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": `https://schema.org/${product.availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    },
    ...(product.reviews && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.reviews.rating,
        "reviewCount": product.reviews.count
      }
    })
  };
};

export const generateBreadcrumbRichSnippet = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// SEO-friendly URL utilities
export const SEOUrlUtils = {
  // Convert product name to SEO-friendly slug
  createProductSlug: (name: string, id: number) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
    
    return `${slug}-${id}`;
  },

  // Create category-friendly URLs
  createCategorySlug: (category: string) => {
    return category
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim('-');
  },

  // Extract product ID from SEO URL
  extractProductId: (slug: string) => {
    const match = slug.match(/-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  },
};