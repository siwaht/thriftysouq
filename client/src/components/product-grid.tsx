import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({ products, isLoading, onProductClick }: ProductGridProps) {
  const [sortBy, setSortBy] = useState("discount-desc");

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch(sortBy) {
      case 'discount-desc':
        return b.discount - a.discount;
      case 'discount-asc':
        return a.discount - b.discount;
      case 'price-asc':
        return parseFloat(a.discountedPrice) - parseFloat(b.discountedPrice);
      case 'price-desc':
        return parseFloat(b.discountedPrice) - parseFloat(a.discountedPrice);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean product grid with subtle fade-in animation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
              />
            </div>
          ))}
        </div>

        {/* Enhanced empty state */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or check back later for new arrivals</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
