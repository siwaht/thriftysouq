export default function Footer() {
  return (
    <footer className="luxury-gradient-purple text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0">
          <div className="space-y-6">
            <h4 className="text-3xl font-light tracking-tight">
              LuxDeal <span className="text-luxury-gold font-normal">Quick</span>
            </h4>
            <p className="text-purple-100 max-w-md leading-relaxed text-lg">
              Exceptional luxury brands at unprecedented discounts. 
              Curated for the discerning few who value both quality and value.
            </p>
          </div>
          
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-luxury-gold">Quick Links</h5>
            <div className="flex flex-col space-y-4 text-purple-200">
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300 text-lg">Terms of Service</a>
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300 text-lg">Privacy Policy</a>
              <a href="#" className="hover:text-luxury-gold transition-colors duration-300 text-lg">Contact Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-400/20 mt-16 pt-10 text-center">
          <p className="text-purple-200 font-light text-lg">
            &copy; 2025 LuxDeal Quick. All rights reserved. | Authentic luxury, verified quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
