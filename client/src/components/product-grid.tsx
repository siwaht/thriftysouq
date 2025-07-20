import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick?: (product: Product) => void;
  onExpressCheckout?: (product: Product) => void;
}

export default function ProductGrid({ products, isLoading, onProductClick, onExpressCheckout }: ProductGridProps) {
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
    <section id="products" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Curated <span className="text-emerald-600">Collection</span>
            </h3>
            <p className="text-slate-600">Exceptional luxury brands</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard 
                product={product} 
                onProductClick={onProductClick}
                onExpressCheckout={onExpressCheckout}
              />
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
