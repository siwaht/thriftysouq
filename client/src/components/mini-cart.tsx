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
      <SheetContent className="w-full sm:w-96 sm:max-w-md bg-white flex flex-col h-full mobile-tap">
        <SheetHeader className="border-b border-slate-200 pb-4 flex-shrink-0">
          <SheetTitle className="font-display text-xl sm:text-2xl font-bold text-slate-900">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1 py-4">
            <div className="pr-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 py-3 border-b border-slate-100 last:border-b-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h5>
                        <p className="text-slate-600 text-sm">
                          ${parseFloat(item.discountedPrice).toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full mobile-tap"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm px-2 font-medium min-w-[28px] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full mobile-tap"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 h-6 w-6 mobile-tap"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-slate-200 pt-4 pb-4 flex-shrink-0 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-slate-900">Total:</span>
              <span className="text-2xl font-bold text-emerald-600">
                ${getCartTotal().toLocaleString()}
              </span>
            </div>
            <Button 
              className="w-full btn-emerald py-3 text-base font-semibold rounded-lg mobile-tap"
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
