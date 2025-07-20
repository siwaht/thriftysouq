import { Button } from "@/components/ui/button";

export default function HeroBanner() {

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 luxury-gradient text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-transparent to-violet-900/30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-gold/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light tracking-tight mb-6 sm:mb-8 will-change-transform">
            Exceptional <span className="luxury-gradient-gold-purple bg-clip-text text-transparent font-normal">Luxury</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-100 mb-8 sm:mb-10 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Discover premium brands at unprecedented discounts. 
            <span className="block mt-2 sm:mt-3 text-luxury-gold font-medium text-base sm:text-lg lg:text-xl">Up to 70% off authentic luxury pieces</span>
          </p>

          <Button 
            onClick={scrollToProducts}
            className="luxury-gradient-gold-purple hover:scale-105 sm:hover:scale-110 text-white font-bold px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl rounded-full transition-all duration-500 shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30 mobile-optimized"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
