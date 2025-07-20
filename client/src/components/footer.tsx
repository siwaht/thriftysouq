import { Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              thrifty<span className="text-emerald-400">souq</span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Transforming luxury shopping with authentic designer brands at unprecedented discounts across the UAE market.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                Features
              </a>
              <a href="#" className="block text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                Contact Us
              </a>
              <a href="#" className="block text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-slate-300 hover:text-emerald-400 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:support@thriftysouq.com" className="text-slate-300 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+971-4-THRIFTY" className="text-slate-300 hover:text-emerald-400 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 ThriftySouq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
