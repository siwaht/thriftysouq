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
    <section className="relative pt-16 bg-gradient-to-r from-black to-gray-900 text-white">
      {/* Hero background with luxury pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="h-full w-full bg-luxury-gold" 
          style={{
            backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(212, 175, 55, 0.1) 20%, rgba(212, 175, 55, 0.1) 40%, transparent 40%, transparent)'
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl lg:text-7xl font-bold mb-6">
            Up to <span className="text-luxury-gold">70% OFF</span><br />
            Luxury Items
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium brands like Rolex, Ray-Ban, Tiffany & Co., Louis Vuitton, and Gucci at unbeatable prices
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{timeLeft} Left</span>
            </div>
            <span className="text-gray-300">Limited Time Offer</span>
          </div>
          <Button 
            onClick={scrollToProducts}
            className="bg-luxury-gold hover:bg-yellow-500 text-black font-semibold px-8 py-4 text-lg h-auto"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}
