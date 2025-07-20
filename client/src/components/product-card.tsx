import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { QuickActions } from "./quick-actions";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  onExpressCheckout?: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick, onExpressCheckout }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleExpressCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpressCheckout) {
      onExpressCheckout(product);
    }
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <Card 
      className="group bg-white border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{product.discount}%
        </Badge>
        <QuickActions product={product} variant="card" />
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <div className="text-xs font-semibold text-emerald-600 mb-1 uppercase">{product.brand}</div>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
          {product.name}
        </h4>
        
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-lg sm:text-xl font-bold text-slate-900">
            AED {parseFloat(product.discountedPrice).toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 line-through">
            AED {parseFloat(product.originalPrice).toLocaleString()}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm font-medium rounded-md"
            size="sm"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button 
            onClick={handleExpressCheckout}
            variant="outline"
            className="px-3 py-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-md"
            size="sm"
          >
            <Zap className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
