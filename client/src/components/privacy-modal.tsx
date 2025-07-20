import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Privacy Policy</DialogTitle>
          <p className="text-slate-600">Last updated: January 20, 2025</p>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Introduction</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              ThriftySouq is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website thriftysouq.com and use our services in the United Arab Emirates.
            </p>
            <p className="text-slate-700 leading-relaxed">
              This policy complies with UAE Federal Law No. 45 of 2021 on the Protection of Personal Data.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h3>
            <h4 className="font-semibold text-slate-800 mb-2">Personal Information</h4>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Order history and preferences</li>
            </ul>

            <h4 className="font-semibold text-slate-800 mb-2">Technical Information</h4>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Website usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. How We Use Your Information</h3>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>Processing and fulfilling your orders</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Sending order confirmations and shipping updates</li>
              <li>Improving our website, products, and services</li>
              <li>Sending promotional offers (with your consent)</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Information Sharing</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li><strong>Service Providers:</strong> Trusted third parties for payment processing and shipping</li>
              <li><strong>Legal Requirements:</strong> When required by UAE law</li>
              <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              <li><strong>Consent:</strong> With your explicit permission</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. Data Security</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">6. Your Rights</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              Under UAE data protection law, you have the following rights:
            </p>
            <ul className="list-disc pl-5 text-slate-700 mb-3 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:cc@thriftysouq.com" className="text-emerald-600 hover:text-emerald-700">cc@thriftysouq.com</a>
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">7. Cookies and Tracking</h3>
            <p className="text-slate-700 leading-relaxed mb-3">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">8. Data Retention</h3>
            <p className="text-slate-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy. Order information is typically retained for 7 years for accounting and tax purposes as required by UAE law.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">9. International Transfers</h3>
            <p className="text-slate-700 leading-relaxed">
              Your information may be transferred to and processed in countries outside the UAE. We ensure appropriate safeguards are in place to protect your data in accordance with UAE data protection standards.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">10. Children's Privacy</h3>
            <p className="text-slate-700 leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">11. Changes to This Policy</h3>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}