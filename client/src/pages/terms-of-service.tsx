import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ThriftySouq
          </Link>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-slate-300 mt-2">Last updated: January 20, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and ThriftySouq ("Company," "we," "our," or "us") concerning your access to and use of the thriftysouq.com website and any related services provided by us.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By accessing or using our website, you agree that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the website and must discontinue use immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms are effective as of the date of your first use of the website and shall remain in effect until terminated in accordance with these Terms. We reserve the right to update, change, or replace any part of these Terms by posting updates to our website. It is your responsibility to check this page periodically for changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Use License</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on ThriftySouq's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
            <p className="text-slate-700 leading-relaxed">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Product Information and Availability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We strive to provide accurate product information, including descriptions, prices, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            <p className="text-slate-700 leading-relaxed">
              All products are subject to availability. We reserve the right to limit quantities available for purchase and to discontinue any product at any time. Product prices are subject to change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Orders and Payment</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By placing an order through our website, you warrant that you are legally capable of entering into binding contracts and are at least 18 years of age. All orders are subject to acceptance and availability.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to refuse or cancel any order for any reason, including but not limited to product or service availability, errors in product or pricing information, or problems identified by our credit and fraud detection systems.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Payment must be received in full before shipment of products. We accept major credit cards and other payment methods as displayed during checkout. All prices are listed in UAE Dirhams (AED).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Shipping and Delivery</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We offer shipping within the United Arab Emirates. Shipping costs and delivery timeframes are calculated at checkout based on your location and selected shipping method.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Risk of loss and title for products purchased from our website pass to you upon delivery to the shipping address you provide. We are not responsible for packages lost or stolen after delivery confirmation.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Delivery timeframes are estimates only and may vary due to circumstances beyond our control, including but not limited to customs delays, weather conditions, or carrier issues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Returns and Exchanges Policy</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-4">
              <h3 className="text-xl font-bold text-red-800 mb-3">NO RETURNS OR EXCHANGES</h3>
              <p className="text-red-700 leading-relaxed mb-3">
                <strong>ALL SALES ARE FINAL.</strong> ThriftySouq does not accept returns, exchanges, or provide refunds for any products purchased through our website under any circumstances.
              </p>
              <p className="text-red-700 leading-relaxed mb-3">
                This policy applies to all products regardless of condition, size, color, or any other factor. Please review your order carefully before completing your purchase, as no changes can be made after order confirmation.
              </p>
              <p className="text-red-700 leading-relaxed">
                By completing a purchase, you acknowledge and agree that all sales are final and that you waive any right to return, exchange, or obtain a refund for your purchase.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Product Authenticity</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ThriftySouq guarantees that all luxury branded products sold on our platform are authentic. We source our products from authorized dealers and verified suppliers only.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Each product undergoes authentication verification before listing. However, given our no-returns policy, we encourage customers to carefully review product descriptions and images before purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. User Accounts and Registration</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Creating an account is not required to make purchases, but may be offered for enhanced features. If you create an account, you are responsible for maintaining the confidentiality of your account information and password.
            </p>
            <p className="text-slate-700 leading-relaxed">
              You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Prohibited Uses</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You may not use our website:</p>
            <ul className="list-disc pl-6 text-slate-700 mb-4">
              <li>For any unlawful purpose or to solicit others to engage in unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent security features of our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Intellectual Property Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The website and its original content, features, and functionality are and will remain the exclusive property of ThriftySouq and its licensors. The website is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, ThriftySouq excludes all representations, warranties, conditions, and terms whether express or implied.
            </p>
            <p className="text-slate-700 leading-relaxed">
              ThriftySouq shall not be liable for any loss, damage, or expense arising from your use of this website or reliance on information contained herein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In no event shall ThriftySouq, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, punitive, consequential, or special damages arising from your use of the website.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Our total liability to you for all damages, losses, and causes of action shall not exceed the amount paid by you to ThriftySouq for products purchased through the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the United Arab Emirates. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Severability</h2>
            <p className="text-slate-700 leading-relaxed">
              If any provision of these Terms is deemed invalid, unlawful, void, or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed severed from these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Termination</h2>
            <p className="text-slate-700 leading-relaxed">
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the website will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}