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
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-4 left-4 bg-red-600 text-white">
          {product.discount}% OFF
        </Badge>
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-white bg-opacity-90"
        >
          {product.stock} left
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="text-sm text-gray-600 mb-1">{product.brand}</div>
        <h4 className="text-lg font-semibold text-black mb-3 line-clamp-2">
          {product.name}
        </h4>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-luxury-gold">
              ${parseFloat(product.discountedPrice).toLocaleString()}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ${parseFloat(product.originalPrice).toLocaleString()}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-black text-white hover:bg-gray-800"
          disabled={product.stock === 0}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
