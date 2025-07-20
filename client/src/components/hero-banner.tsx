import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { HeroBanner } from "@shared/schema";

export default function HeroBanner() {
  const { data: banner } = useQuery<HeroBanner>({
    queryKey: ["/api/hero-banner"],
  });

  // Use default values if no banner data is available
  const bannerData = banner || {
    badgeIcon: "Sparkles",
    badgeText: "Luxury at unprecedented prices",
    mainTitle: "Premium",
    highlightTitle: "Luxury",
    subtitle: "Made Accessible",
    description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
    buttonText: "Explore Collection",
    footerText: "Free shipping on orders over $200",
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden min-h-[95vh] flex items-center">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-emerald-900/20 via-slate-900/50 to-slate-950"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 mb-10 text-sm font-medium shadow-xl">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-white/90 font-semibold tracking-wide">{bannerData.badgeText}</span>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Hero Title */}
          <div className="mb-8 space-y-4">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="block bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent drop-shadow-sm">
                {bannerData.mainTitle}
              </span>
              <span className="block bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                {bannerData.highlightTitle}
              </span>
            </h1>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-slate-300/90">
              {bannerData.subtitle}
            </h2>
          </div>
          
          {/* Description */}
          <p className="text-xl sm:text-2xl text-slate-300/80 mb-14 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            {bannerData.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              onClick={scrollToProducts}
              className="relative group bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:scale-105 transform transition-all duration-300 border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{bannerData.buttonText}</span>
              <ArrowRight className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <div className="flex items-center gap-3 text-slate-400/80 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-medium">{bannerData.footerText}</span>
            </div>
          </div>

          {/* Stats or Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">70%</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Max Savings</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">24h</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Fast Delivery</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Authentic</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-400">10K+</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <div className="text-xs text-slate-400 uppercase tracking-widest">Explore</div>
          <div className="w-6 h-10 border-2 border-slate-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
