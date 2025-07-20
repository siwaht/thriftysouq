import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function MiniCart({ isOpen, onClose, onCheckout }: MiniCartProps) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      onCheckout();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-96 sm:max-w-md bg-white mobile-optimized">
        <SheetHeader className="border-b border-gray-100 pb-4">
          <SheetTitle className="text-xl sm:text-2xl font-light text-luxury-dark">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-2 sm:pr-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 py-2 sm:py-3 border-b border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-xs sm:text-sm truncate">{item.name}</h5>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        ${parseFloat(item.discountedPrice).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 mobile-optimized"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                        <span className="text-xs sm:text-sm px-2 font-medium min-w-[24px] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 mobile-optimized"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 h-5 w-5 sm:h-6 sm:w-6 mobile-optimized"
                    >
                      <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-gray-100 pt-4 sm:pt-6 mt-4 sm:mt-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-base sm:text-lg font-medium text-luxury-dark">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-luxury-gold">
                ${getCartTotal().toLocaleString()}
              </span>
            </div>
            <Button 
              className="w-full luxury-gradient-purple text-white hover:scale-105 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 border border-purple-400/30 mobile-optimized"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              {cartItems.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
