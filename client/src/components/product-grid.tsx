import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
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
      <section id="products" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-modern h-96 animate-pulse">
                <div className="bg-slate-200 h-64 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="bg-slate-200 h-4 w-20 rounded"></div>
                  <div className="bg-slate-200 h-5 w-full rounded"></div>
                  <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-slate-200 h-10 w-full rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 sm:mb-14 lg:mb-16 space-y-6 lg:space-y-0">
          <div className="animate-slide-up">
            <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-3 sm:mb-4 text-balance">
              Curated <span className="text-emerald-600">Collection</span>
            </h3>
            <p className="text-slate-600 text-lg sm:text-xl font-light">Discover exceptional pieces from the world's finest brands</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-56 card-modern border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 mobile-tap">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount-desc">Best Deals</SelectItem>
              <SelectItem value="price-asc">Price: Low</SelectItem>
              <SelectItem value="price-desc">Price: High</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {sortedProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-light text-gray-600 mb-4">No products found</h3>
              <p className="text-gray-500 mb-6">Check back later for new luxury arrivals.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
