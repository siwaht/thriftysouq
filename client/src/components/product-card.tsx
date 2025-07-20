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
    <Card className="group hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 overflow-hidden luxury-card-shadow-purple bg-white border border-purple-100/50">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent"></div>
        <Badge className="absolute top-4 left-4 luxury-gradient-gold-purple text-white text-xs font-bold px-4 py-2 shadow-2xl border border-purple-300/30">
          {product.discount}% OFF
        </Badge>
      </div>
      
      <CardContent className="p-6 bg-gradient-to-b from-white to-purple-50/30">
        <div className="text-xs font-bold text-luxury-purple mb-2 tracking-widest uppercase">{product.brand}</div>
        <h4 className="text-lg font-bold text-luxury-black mb-4 line-clamp-2 leading-tight">
          {product.name}
        </h4>
        
        <div className="flex items-baseline space-x-3 mb-6">
          <span className="text-2xl font-black text-luxury-purple">
            ${parseFloat(product.discountedPrice).toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ${parseFloat(product.originalPrice).toLocaleString()}
          </span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full luxury-gradient-purple text-white hover:scale-105 font-bold py-3 rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 group border border-purple-400/30"
          disabled={product.stock === 0}
        >
          <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
