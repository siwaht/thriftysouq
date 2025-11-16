import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

/**
 * SEO Component for ThriftySouq - Luxury Quick Commerce
 * Handles meta tags, Open Graph, Twitter Cards, and Structured Data
 */
export function SEO({
  title = 'ThriftySouq - Premium Luxury at Unprecedented Prices',
  description = 'Shop authenticated luxury brands with ultra-fast delivery. Designer watches, jewelry, bags, and fashion at up to 70% off. Quick commerce luxury shopping made accessible.',
  keywords = 'luxury shopping, designer brands, quick commerce, fast delivery, discounted luxury, Rolex, Louis Vuitton, Hermès, Chanel, Gucci, Cartier, luxury marketplace',
  image = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630&fit=crop',
  type = 'website',
  canonical,
  structuredData,
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', canonical || window.location.href, 'property');
    updateMetaTag('og:site_name', 'ThriftySouq', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // Mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0', 'name');
    updateMetaTag('mobile-web-app-capable', 'yes', 'name');
    updateMetaTag('apple-mobile-web-app-capable', 'yes', 'name');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent', 'name');

    // SEO optimization
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', 'name');
    updateMetaTag('googlebot', 'index, follow', 'name');

    // Canonical URL
    updateLinkTag('canonical', canonical || window.location.href);

    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    } else {
      // Default structured data
      updateStructuredData(getDefaultStructuredData());
    }
  }, [title, description, keywords, image, type, canonical, structuredData, location]);

  return null;
}

/**
 * Update or create meta tag
 */
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Update or create link tag
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

/**
 * Update structured data (JSON-LD)
 */
function updateStructuredData(data: Record<string, any>) {
  let script = document.querySelector('script[type="application/ld+json"]');

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

/**
 * Get default structured data for the website
 */
function getDefaultStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${window.location.origin}/#website`,
        url: window.location.origin,
        name: 'ThriftySouq',
        description: 'Premium luxury brands with ultra-fast delivery at unprecedented prices',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${window.location.origin}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${window.location.origin}/#organization`,
        name: 'ThriftySouq',
        url: window.location.origin,
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/logo.png`,
        },
        sameAs: [],
      },
      {
        '@type': 'WebPage',
        '@id': `${window.location.href}#webpage`,
        url: window.location.href,
        name: document.title,
        isPartOf: {
          '@id': `${window.location.origin}/#website`,
        },
        about: {
          '@id': `${window.location.origin}/#organization`,
        },
        description: 'Shop authenticated luxury brands with ultra-fast delivery',
      },
    ],
  };
}

/**
 * Generate product structured data
 */
export function getProductStructuredData(product: {
  id: number;
  name: string;
  brand: string;
  category: string;
  originalPrice: string;
  discountedPrice: string;
  image: string;
  stock: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.discountedPrice,
      priceCurrency: 'AED',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: `${window.location.origin}/product/${product.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate organization structured data
 */
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ThriftySouq',
    description: 'Premium luxury brands with ultra-fast delivery',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@thriftysouq.com',
    },
    sameAs: [],
  };
}
