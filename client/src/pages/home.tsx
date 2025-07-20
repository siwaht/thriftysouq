import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
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

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleOrderSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />
        <HeroBanner />
        <ProductGrid products={products} isLoading={isLoading} />
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
