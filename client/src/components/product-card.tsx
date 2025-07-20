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
    <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden luxury-card-shadow bg-white border-0">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <Badge className="absolute top-4 left-4 bg-luxury-gold text-black text-xs font-semibold px-3 py-1 shadow-lg">
          {product.discount}% OFF
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="text-xs font-medium text-luxury-gold mb-2 tracking-wider uppercase">{product.brand}</div>
        <h4 className="text-lg font-semibold text-luxury-dark mb-4 line-clamp-2 leading-tight">
          {product.name}
        </h4>
        
        <div className="flex items-baseline space-x-3 mb-6">
          <span className="text-2xl font-bold text-luxury-dark">
            ${parseFloat(product.discountedPrice).toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${parseFloat(product.originalPrice).toLocaleString()}
          </span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-luxury-dark text-white hover:bg-gray-800 font-medium py-3 rounded-xl transition-all duration-300 hover:shadow-lg group"
          disabled={product.stock === 0}
        >
          <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
