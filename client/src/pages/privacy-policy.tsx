import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ThriftySouq
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-slate-300 mt-2">Last updated: January 20, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ThriftySouq ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website thriftysouq.com and use our services in the United Arab Emirates.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By using our website, you consent to the data practices described in this policy. This policy complies with UAE Federal Law No. 45 of 2021 on the Protection of Personal Data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3">2.1 Personal Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">We may collect the following personal information:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Technical Information</h3>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Website usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Processing and fulfilling your orders</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Sending order confirmations, shipping updates, and delivery notifications</li>
              <li>Improving our website, products, and services</li>
              <li>Sending promotional offers and marketing communications (with your consent)</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li><strong>Service Providers:</strong> Trusted third parties who assist with payment processing, shipping, and website analytics</li>
              <li><strong>Legal Requirements:</strong> When required by UAE law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit permission for specific purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Employee training on data protection practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Under UAE data protection law, you have the following rights:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:privacy@thriftysouq.com" className="text-emerald-600 hover:text-emerald-700">privacy@thriftysouq.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Types of cookies we use include essential cookies (required for website functionality), analytics cookies (to understand user behavior), and marketing cookies (for personalized advertising, with your consent).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order information is typically retained for 7 years for accounting and tax purposes as required by UAE law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. International Transfers</h2>
            <p className="text-slate-700 leading-relaxed">
              Your information may be transferred to and processed in countries outside the UAE. We ensure appropriate safeguards are in place to protect your data in accordance with UAE data protection standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
            </p>
          </section>



        </div>
      </div>
    </div>
  );
}