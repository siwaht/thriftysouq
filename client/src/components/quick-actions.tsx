import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Share2, Zap } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface QuickActionsProps {
  product: Product;
  variant?: "card" | "modal";
}

export function QuickActions({ product, variant = "card" }: QuickActionsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added successfully`,
      duration: 1500,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
      duration: 1500,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.discount}% off deal on ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
        duration: 1500,
      });
    }
  };

  if (variant === "modal") {
    return (
      <div className="flex space-x-3">
        <Button 
          onClick={handleQuickAdd}
          className="flex-1 btn-emerald py-4 text-lg font-semibold rounded-xl group"
          disabled={product.stock === 0}
        >
          <Zap className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          {product.stock === 0 ? "Out of Stock" : "Quick Add"}
        </Button>
        <Button
          onClick={handleWishlist}
          variant="outline"
          size="lg"
          className={`p-4 rounded-xl transition-colors ${
            isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="p-4 rounded-xl hover:text-emerald-600"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <Button
        onClick={handleWishlist}
        variant="outline"
        size="sm"
        className={`w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-white/20 transition-colors ${
          isWishlisted ? 'text-red-500 border-red-200' : 'hover:text-red-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </Button>
      <Button
        onClick={handleQuickAdd}
        variant="outline"
        size="sm"
        className="w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-white/20 hover:text-emerald-600"
        disabled={product.stock === 0}
      >
        <Zap className="w-4 h-4" />
      </Button>
    </div>
  );
}