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
    <Card className="group card-modern card-hover overflow-hidden mobile-tap will-change-transform animate-scale-in">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Badge className="absolute top-4 left-4 bg-gradient-emerald text-white text-xs font-bold px-3 py-1.5 shadow-emerald rounded-full">
          -{product.discount}%
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="text-xs font-semibold text-emerald-600 mb-2 tracking-wider uppercase">{product.brand}</div>
        <h4 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h4>
        
        <div className="flex items-baseline space-x-3 mb-6">
          <span className="text-2xl font-black text-slate-900">
            ${parseFloat(product.discountedPrice).toLocaleString()}
          </span>
          <span className="text-sm text-slate-400 line-through">
            ${parseFloat(product.originalPrice).toLocaleString()}
          </span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full btn-emerald py-3 text-sm font-semibold rounded-lg group"
          disabled={product.stock === 0}
        >
          <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
