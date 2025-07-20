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
      <SheetContent className="w-96 sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">Shopping Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">{item.name}</h5>
                      <p className="text-gray-600 text-sm">
                        ${parseFloat(item.discountedPrice).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-semibold px-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
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
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-luxury-gold">
                ${getCartTotal().toLocaleString()}
              </span>
            </div>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
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
