import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroBanner from "@/components/hero-banner";
import ProductGrid from "@/components/product-grid";
import MiniCart from "@/components/mini-cart";
import CheckoutModal from "@/components/checkout-modal";
import SuccessModal from "@/components/success-modal";
import { ProductDetailModal } from "@/components/product-detail-modal";

import { SmartFilters } from "@/components/smart-filters";
import Footer from "@/components/footer";
import { CartProvider } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on selected category
  const categoryFilteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  // Sort products based on selected sort option
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "price-high":
        return sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "featured":
      default:
        return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }
  };

  // Use smart-filtered products or category-filtered products, then sort
  const baseProducts = filteredProducts.length > 0 || showFilters 
    ? filteredProducts 
    : categoryFilteredProducts;
  
  const displayProducts = sortProducts(baseProducts);

  // Listen for category filter changes from navigation
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      setCategoryFilter(event.detail);
    };

    window.addEventListener('filterProducts', handleFilterChange as EventListener);
    return () => {
      window.removeEventListener('filterProducts', handleFilterChange as EventListener);
    };
  }, []);

  const handleOrderSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsSuccessOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleSmartFilterChange = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-violet-100">
        <Navigation onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <HeroBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="py-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-500">
              <span className="hover:text-emerald-600 cursor-pointer">Home</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">
                {categoryFilter === "all" ? "All Products" : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
              </span>
            </div>
          </div>

          {/* Enhanced Section Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {categoryFilter === "all" ? "Luxury Collection" : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600 font-medium">
                    {displayProducts.length} {displayProducts.length === 1 ? 'item' : 'items'}
                  </span>
                  {categoryFilter !== "all" && (
                    <span className="text-emerald-600 font-medium">
                      Up to 70% off
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showFilters 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  <span className="hidden sm:inline">
                    {showFilters ? "Hide" : "Filter"}
                  </span>
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {showFilters && categoryFilter !== "all" && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    {categoryFilter}
                    <button 
                      onClick={() => setCategoryFilter("all")}
                      className="ml-1 hover:text-emerald-900 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {showFilters && (
            <div className="mb-8">
              <SmartFilters 
                products={categoryFilteredProducts}
                onFilterChange={handleSmartFilterChange}
                className="sticky top-20 z-10"
              />
            </div>
          )}
        </div>

        <ProductGrid 
          products={displayProducts} 
          isLoading={isLoading} 
          onProductClick={handleProductClick}
        />
        <Footer />
        
        <MiniCart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
        
        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
        
        <SuccessModal 
          isOpen={isSuccessOpen}
          onClose={() => setIsSuccessOpen(false)}
          orderNumber={orderNumber}
        />

        <ProductDetailModal
          product={selectedProduct}
          isOpen={isProductDetailOpen}
          onClose={() => setIsProductDetailOpen(false)}
        />
      </div>
    </CartProvider>
  );
}
