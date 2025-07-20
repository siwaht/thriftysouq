import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("discount-desc");

  // Filter products based on category
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      setCurrentFilter(event.detail);
    };

    window.addEventListener('filterProducts', handleFilterChange as EventListener);
    return () => window.removeEventListener('filterProducts', handleFilterChange as EventListener);
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = currentFilter === "all" 
      ? products 
      : products.filter(p => p.category === currentFilter);

    // Sort products
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'discount-desc':
          return b.discount - a.discount;
        case 'discount-asc':
          return a.discount - b.discount;
        case 'price-asc':
          return parseFloat(a.discountedPrice) - parseFloat(b.discountedPrice);
        case 'price-desc':
          return parseFloat(b.discountedPrice) - parseFloat(a.discountedPrice);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, currentFilter, sortBy]);

  if (isLoading) {
    return (
      <section id="products" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-purple-50/50 via-white to-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-purple-100/50 rounded-xl h-80 sm:h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-purple-50/50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 lg:mb-12 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-luxury-black mb-2 sm:mb-3">
              Curated <span className="text-luxury-purple font-normal">Collection</span>
            </h3>
            <p className="text-gray-700 font-light text-base sm:text-lg">Discover exceptional pieces from the world's finest brands</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48 border-purple-200 rounded-xl bg-white/80 backdrop-blur-sm mobile-optimized">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount-desc">Best Deals</SelectItem>
              <SelectItem value="price-asc">Price: Low</SelectItem>
              <SelectItem value="price-desc">Price: High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
