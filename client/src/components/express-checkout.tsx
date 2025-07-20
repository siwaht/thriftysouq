import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck, Clock, Shield } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

interface ExpressCheckoutProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

export function ExpressCheckout({ product, isOpen, onClose, onSuccess }: ExpressCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  // Early return if product is null
  if (!product) {
    return null;
  }

  const totalPrice = parseFloat(product.discountedPrice) * quantity;
  const savings = (parseFloat(product.originalPrice) - parseFloat(product.discountedPrice)) * quantity;

  const handleExpressCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate express checkout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderNumber = `LD-${Date.now().toString().slice(-6)}`;
    onSuccess(orderNumber);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto w-[95%] sm:w-full modal-content modal-scroll">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-slate-100">
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Express Checkout</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-1 pb-4">
          {/* Product Summary */}
          <div className="flex space-x-4 p-4 bg-slate-50 rounded-xl">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-sm">{product.name}</h3>
              <p className="text-emerald-600 text-xs font-medium">{product.brand}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-bold text-slate-900">AED {totalPrice.toFixed(2)}</span>
                <Badge className="bg-gradient-emerald text-white text-xs">
                  -{product.discount}%
                </Badge>
              </div>
            </div>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
              <SelectTrigger className="w-16 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Express Benefits */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-emerald-700">Free Shipping</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-emerald-700">24h Delivery</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-medium text-emerald-700">Secure</p>
            </div>
          </div>

          {/* Quick Form */}
          <div className="space-y-3">
            <Input placeholder="Email" type="email" className="mobile-optimized text-base" style={{ fontSize: '16px' }} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First name" className="mobile-optimized text-base" style={{ fontSize: '16px' }} />
              <Input placeholder="Last name" className="mobile-optimized text-base" style={{ fontSize: '16px' }} />
            </div>
            <Input placeholder="Phone" type="tel" className="mobile-optimized text-base" style={{ fontSize: '16px' }} />
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>AED {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-emerald-600">
              <span>You save:</span>
              <span>-AED {savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span className="text-emerald-600">FREE</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>AED {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button 
            onClick={handleExpressCheckout}
            className="w-full btn-emerald py-4 text-lg font-semibold rounded-xl"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay AED ${totalPrice.toFixed(2)}`}
          </Button>

          <p className="text-xs text-center text-slate-500">
            Secure checkout powered by industry-leading encryption
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}