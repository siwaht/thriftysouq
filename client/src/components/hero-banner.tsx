import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h2 className="text-6xl lg:text-8xl font-light tracking-tight mb-8">
            Exceptional <span className="luxury-gradient-gold-purple bg-clip-text text-transparent font-normal">Luxury</span>
          </h2>
          <p className="text-2xl text-purple-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Discover premium brands at unprecedented discounts. 
            <span className="block mt-3 text-luxury-gold font-medium text-xl">Up to 70% off authentic luxury pieces</span>
          </p>
          <div className="flex justify-center items-center space-x-4 mb-12">
            <div className="bg-purple-900/30 backdrop-blur-lg border border-purple-400/30 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-3 shadow-2xl">
              <Clock className="h-5 w-5 text-luxury-gold" />
              <span className="text-xl font-semibold">{timeLeft}</span>
              <span className="text-purple-200">remaining</span>
            </div>
          </div>
          <Button 
            onClick={scrollToProducts}
            className="luxury-gradient-gold-purple hover:scale-110 text-white font-bold px-12 py-5 text-xl rounded-full transition-all duration-500 shadow-2xl hover:shadow-purple-500/25 border border-purple-400/30"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
