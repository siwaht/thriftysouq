import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 bg-gradient-modern text-white overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-emerald-500/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Luxury at unprecedented prices
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance">
            Premium{" "}
            <span className="bg-gradient-emerald bg-clip-text text-transparent">
              Luxury
            </span>
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light">
              Made Accessible
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Discover authenticated luxury brands at{" "}
            <span className="text-amber-400 font-semibold">up to 70% off</span>.
            <br className="hidden sm:block" />
            Curated collections from the world's finest houses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToProducts}
              className="btn-emerald text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-emerald group"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Free shipping on orders over $200
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
