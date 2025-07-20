import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
          {product.discount}% OFF
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-gray-600 mb-1">{product.brand}</div>
        <h4 className="text-sm font-semibold text-black mb-2 line-clamp-2">
          {product.name}
        </h4>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-luxury-gold">
            ${parseFloat(product.discountedPrice).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${parseFloat(product.originalPrice).toLocaleString()}
          </span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-black text-white hover:bg-gray-800 text-sm py-2"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
