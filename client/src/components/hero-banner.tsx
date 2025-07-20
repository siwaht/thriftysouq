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
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl lg:text-7xl font-light tracking-tight mb-6">
            Exceptional <span className="text-luxury-gold font-normal">Luxury</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Discover premium brands at unprecedented discounts. 
            <span className="block mt-2 text-luxury-gold font-medium">Up to 70% off authentic luxury pieces</span>
          </p>
          <div className="flex justify-center items-center space-x-4 mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-medium flex items-center space-x-2 shadow-xl">
              <Clock className="h-4 w-4 text-luxury-gold" />
              <span className="text-lg">{timeLeft}</span>
              <span className="text-sm text-gray-300">remaining</span>
            </div>
          </div>
          <Button 
            onClick={scrollToProducts}
            className="bg-luxury-gold hover:bg-yellow-400 text-black font-semibold px-10 py-4 text-lg rounded-full transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-105"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </section>
  );
}
