import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export default function SuccessModal({ isOpen, onClose, orderNumber }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-semibold mb-2">Order Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">Order Number</div>
            <div className="font-semibold text-lg">{orderNumber}</div>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-luxury-gold hover:bg-yellow-500 text-black font-semibold"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
