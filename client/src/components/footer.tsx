export default function Footer() {
  return (
    <footer className="luxury-gradient-dark text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-12 sm:space-y-16 md:space-y-0">
          <div className="space-y-6 sm:space-y-8">
            <h4 className="text-3xl sm:text-4xl font-bold tracking-tight">
              thrifty<span className="text-emerald-400 font-normal">souq</span>
            </h4>
            <p className="text-luxury-body text-slate-200 max-w-lg leading-relaxed text-lg sm:text-xl font-light">
              Exceptional luxury brands at unprecedented discounts. 
              Curated for the discerning few who value both quality and value.
            </p>
            <div className="grid grid-cols-3 gap-8 sm:gap-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">70%</div>
                <div className="text-xs text-slate-300 uppercase tracking-widest font-medium">Max Discount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">100%</div>
                <div className="text-xs text-slate-300 uppercase tracking-widest font-medium">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs text-slate-300 uppercase tracking-widest font-medium">Support</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            <h5 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Quick Links</h5>
            <div className="flex flex-col space-y-4 sm:space-y-5 text-slate-200">
              <a href="#" className="hover:text-emerald-300 transition-all duration-300 text-lg sm:text-xl mobile-tap hover:translate-x-1 transform">Terms of Service</a>
              <a href="#" className="hover:text-emerald-300 transition-all duration-300 text-lg sm:text-xl mobile-tap hover:translate-x-1 transform">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-300 transition-all duration-300 text-lg sm:text-xl mobile-tap hover:translate-x-1 transform">Contact Support</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-600/50 mt-16 sm:mt-20 pt-10 sm:pt-12 text-center">
          <p className="text-luxury-body text-slate-300 font-light text-lg sm:text-xl">
            &copy; 2025 ThriftySouq. All rights reserved. | Authentic luxury, verified quality.
          </p>
        </div>
      </div>
    </footer>
  );
}
