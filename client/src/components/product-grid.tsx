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
      <section id="products" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-black">Featured Products</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount-desc">Highest Discount</SelectItem>
              <SelectItem value="discount-asc">Lowest Discount</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
