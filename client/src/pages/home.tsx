import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroBanner from "@/components/hero-banner";
import ProductGrid from "@/components/product-grid";
import MiniCart from "@/components/mini-cart";
import CheckoutModal from "@/components/checkout-modal";
import SuccessModal from "@/components/success-modal";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { ExpressCheckout } from "@/components/express-checkout";
import { SmartFilters } from "@/components/smart-filters";
import Footer from "@/components/footer";
import { CartProvider } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isExpressCheckoutOpen, setIsExpressCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on selected category
  const categoryFilteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  // Use smart-filtered products or category-filtered products
  const displayProducts = filteredProducts.length > 0 || showFilters 
    ? filteredProducts 
    : categoryFilteredProducts;

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

  const handleExpressCheckout = (product: Product) => {
    setSelectedProduct(product);
    setIsExpressCheckoutOpen(true);
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Shop {categoryFilter === "all" ? "All Products" : categoryFilter}
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {showFilters ? "Hide Filters" : "Show Smart Filters"}
            </button>
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
          onExpressCheckout={handleExpressCheckout}
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

        {selectedProduct && (
          <ExpressCheckout
            product={selectedProduct}
            isOpen={isExpressCheckoutOpen}
            onClose={() => setIsExpressCheckoutOpen(false)}
            onSuccess={handleOrderSuccess}
          />
        )}
      </div>
    </CartProvider>
  );
}
