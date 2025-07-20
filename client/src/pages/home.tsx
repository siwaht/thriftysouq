import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroBanner from "@/components/hero-banner";
import ProductGrid from "@/components/product-grid";
import MiniCart from "@/components/mini-cart";
import CheckoutModal from "@/components/checkout-modal";
import SuccessModal from "@/components/success-modal";
import Footer from "@/components/footer";
import { CartProvider } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products based on selected category
  const filteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.category === categoryFilter);

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

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-violet-100">
        <Navigation onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <HeroBanner />
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
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
      </div>
    </CartProvider>
  );
}
