export default function Footer() {
  return (
    <footer className="luxury-gradient text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          <div className="space-y-4">
            <h4 className="text-2xl font-light tracking-tight">
              LuxDeal <span className="text-luxury-gold font-normal">Quick</span>
            </h4>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Exceptional luxury brands at unprecedented discounts. 
              Curated for the discerning few who value both quality and value.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-medium text-luxury-gold">Quick Links</h5>
            <div className="flex flex-col space-y-3 text-gray-300">
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300">Contact Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm font-light">
            &copy; 2025 LuxDeal Quick. All rights reserved. | Authentic luxury, verified quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
