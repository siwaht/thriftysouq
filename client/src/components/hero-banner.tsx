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
    <section className="relative pt-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-slate-900/60"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white text-sm font-medium">{bannerData.badgeText}</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
              <span className="block text-white">{bannerData.mainTitle}</span>
              <span className="block text-emerald-400">{bannerData.highlightTitle}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl text-slate-300 font-light">
              {bannerData.subtitle}
            </h2>
          </div>
          
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            {bannerData.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={scrollToProducts}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              {bannerData.buttonText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{bannerData.footerText}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-xl font-bold text-emerald-400">70%</div>
              <div className="text-xs text-slate-400">Max Savings</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">24h</div>
              <div className="text-xs text-slate-400">Fast Delivery</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Authentic</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">10K+</div>
              <div className="text-xs text-slate-400">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
