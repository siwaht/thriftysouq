import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Terms of Service</DialogTitle>
          <p className="text-slate-600">Last updated: January 20, 2025</p>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Agreement to Terms</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              These Terms of Service constitute a legally binding agreement between you and ThriftySouq concerning your access to and use of the thriftysouq.com website and any related services provided by us.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By accessing or using our website, you agree that you have read, understood, and agree to be bound by all of these Terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Use License</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Permission is granted to temporarily download one copy of the materials on ThriftySouq's website for personal, non-commercial transitory viewing only. Under this license you may not:
            </p>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Orders and Payment</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              By placing an order, you warrant that you are legally capable of entering into binding contracts and are at least 18 years of age. All orders are subject to acceptance and availability.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Payment must be received in full before shipment. We accept major credit cards and other payment methods as displayed during checkout. All prices are in UAE Dirhams (AED).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Shipping and Delivery</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              We offer shipping within the United Arab Emirates. Shipping costs and delivery timeframes are calculated at checkout based on your location and selected shipping method.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Risk of loss and title for products pass to you upon delivery. We are not responsible for packages lost or stolen after delivery confirmation.
            </p>
          </section>

          <section>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <h3 className="text-lg font-bold text-red-800 mb-2">5. Returns and Exchanges Policy</h3>
              <p className="text-red-700 leading-relaxed mb-2">
                <strong>ALL SALES ARE FINAL.</strong> ThriftySouq does not accept returns, exchanges, or provide refunds for any products purchased through our website under any circumstances.
              </p>
              <p className="text-red-700 leading-relaxed mb-2">
                This policy applies to all products regardless of condition, size, color, or any other factor. Please review your order carefully before completing your purchase.
              </p>
              <p className="text-red-700 leading-relaxed">
                By completing a purchase, you acknowledge and agree that all sales are final and that you waive any right to return, exchange, or obtain a refund.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">6. Product Authenticity</h3>
            <p className="text-slate-700 leading-relaxed">
              ThriftySouq guarantees that all luxury branded products sold on our platform are authentic. We source our products from authorized dealers and verified suppliers only. Each product undergoes authentication verification before listing.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">7. Prohibited Uses</h3>
            <p className="text-slate-700 leading-relaxed mb-3">You may not use our website:</p>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>For any unlawful purpose</li>
              <li>To violate any regulations, rules, or laws</li>
              <li>To infringe upon intellectual property rights</li>
              <li>To submit false or misleading information</li>
              <li>To interfere with security features</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">8. Limitation of Liability</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              ThriftySouq shall not be liable for any indirect, incidental, punitive, consequential, or special damages arising from your use of the website.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Our total liability to you shall not exceed the amount paid by you to ThriftySouq for products purchased through the website.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">9. Governing Law</h3>
            <p className="text-slate-700 leading-relaxed">
              These Terms shall be governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">10. Changes to Terms</h3>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}