import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, Lock, Truck } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  shippingAddress: z.string().min(10, "Please enter your full address"),
  emirate: z.string().min(2, "Emirate is required"),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["online", "cod"]),
  specialInstructions: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
      emirate: "",
      postalCode: "",
      paymentMethod: "online",
      specialInstructions: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const orderData = {
        ...data,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.discountedPrice,
        })),
      };

      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data) => {
      clearCart();
      onSuccess(data.orderNumber);
      toast({
        title: "Order placed successfully!",
        description: `Your order number is ${data.orderNumber}`,
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createOrderMutation.mutate(data);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 3670 ? 0 : 92; // Updated for AED (25 USD * 3.67)
  const total = subtotal + shipping;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-3xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-xl sm:rounded-2xl mobile-optimized" aria-describedby="checkout-description">
        <DialogHeader className="border-b border-gray-100 pb-4 sm:pb-6">
          <DialogTitle className="text-2xl sm:text-3xl font-light text-luxury-dark">Secure Checkout</DialogTitle>
          <p id="checkout-description" className="text-gray-600 mt-2 text-sm sm:text-base">Complete your luxury purchase in seconds</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h4 className="text-lg sm:text-xl font-medium text-luxury-dark mb-4 sm:mb-6">Contact Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="mobile-optimized" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" className="mobile-optimized" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+971 50 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
              <h4 className="text-lg sm:text-xl font-medium text-luxury-dark mb-4 sm:mb-6">Shipping Address</h4>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Building, Floor, Apartment/Villa Number" className="mobile-optimized" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emirate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emirate *</FormLabel>
                      <FormControl>
                        <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="">Select Emirate</option>
                          <option value="Dubai">Dubai</option>
                          <option value="Abu Dhabi">Abu Dhabi</option>
                          <option value="Sharjah">Sharjah</option>
                          <option value="Ajman">Ajman</option>
                          <option value="Umm Al Quwain">Umm Al Quwain</option>
                          <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                          <option value="Fujairah">Fujairah</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" className="mobile-optimized" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Delivery Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ring the doorbell, Leave with security" className="mobile-optimized" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-xl font-medium text-luxury-dark mb-6">Payment Method</h4>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">Online Payment</div>
                                <div className="text-sm text-gray-600">Secure payment via Stripe or PayPal</div>
                              </div>
                              <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">Cash on Delivery</div>
                                <div className="text-sm text-gray-600">Pay when your order arrives</div>
                              </div>
                              <Truck className="h-6 w-6 text-green-600" />
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Order Summary */}
            <div className="luxury-gradient-purple text-white p-8 rounded-2xl border border-purple-400/30">
              <h4 className="text-2xl font-medium mb-8">Order Summary</h4>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-200">
                    <span>{item.name} × {item.quantity}</span>
                    <span>AED {(parseFloat(item.discountedPrice) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-200">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `AED ${shipping}`}</span>
                </div>
                <div className="border-t border-gray-600 pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-semibold">
                    <span>Total:</span>
                    <span className="text-luxury-gold">AED {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full luxury-gradient-gold-purple text-white font-bold py-5 text-xl rounded-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 border border-purple-400/30"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
