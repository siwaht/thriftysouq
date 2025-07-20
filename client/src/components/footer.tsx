export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 sm:space-y-10 md:space-y-0">
          <div className="space-y-4 sm:space-y-6">
            <h4 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              LuxDeal <span className="text-emerald-400 font-light">Quick</span>
            </h4>
            <p className="text-slate-300 max-w-md leading-relaxed text-base sm:text-lg font-light">
              Exceptional luxury brands at unprecedented discounts. 
              Curated for the discerning few who value both quality and value.
            </p>
            <div className="flex space-x-6 sm:space-x-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">70%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Max Discount</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">24/7</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-lg sm:text-xl font-semibold text-emerald-400">Quick Links</h5>
            <div className="flex flex-col space-y-3 sm:space-y-4 text-slate-300">
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300 text-base sm:text-lg mobile-tap">Terms of Service</a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300 text-base sm:text-lg mobile-tap">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors duration-300 text-base sm:text-lg mobile-tap">Contact Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 sm:mt-16 pt-8 sm:pt-10 text-center">
          <p className="text-slate-400 font-light text-base sm:text-lg">
            &copy; 2025 LuxDeal Quick. All rights reserved. | Authentic luxury, verified quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
