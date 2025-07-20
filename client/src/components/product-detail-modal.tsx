import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  // Generate multiple product images (in a real app, these would come from the database)
  const productImages = [
    product.image,
    product.image.replace('unsplash.com', 'picsum.photos'), // Different variations
    product.image.replace('600x400', '600x401'),
    product.image.replace('600x400', '601x400'),
  ];

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-slate-900">
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-gradient-emerald text-white text-sm font-bold px-4 py-2 shadow-emerald rounded-full">
                -{product.discount}% OFF
              </Badge>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-emerald-500 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-2'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <div className="text-sm font-semibold text-emerald-600 mb-2 tracking-wider uppercase">
                {product.brand}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">(4.2) • 156 reviews</span>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-black text-slate-900">
                  ${parseFloat(product.discountedPrice).toLocaleString()}
                </span>
                <span className="text-xl text-slate-400 line-through">
                  ${parseFloat(product.originalPrice).toLocaleString()}
                </span>
              </div>
              <div className="text-emerald-600 font-semibold">
                You save ${(parseFloat(product.originalPrice) - parseFloat(product.discountedPrice)).toLocaleString()}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                Experience luxury and sophistication with this premium {product.category} from {product.brand}. 
                Crafted with attention to detail and using only the finest materials, this piece represents 
                the perfect blend of style, quality, and value. Originally priced at ${product.originalPrice}, 
                now available at an exclusive {product.discount}% discount for a limited time.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Features</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Premium quality materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Fast & free shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full btn-emerald py-4 text-lg font-semibold rounded-xl group"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}