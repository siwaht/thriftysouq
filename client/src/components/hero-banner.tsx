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
    <section className="relative pt-16 bg-black text-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4">
            Up to <span className="text-luxury-gold">70% OFF</span>
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
            Luxury brands at unbeatable prices
          </p>
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="bg-red-600 text-white px-3 py-1 rounded font-semibold flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-sm">{timeLeft}</span>
            </div>
          </div>
          <Button 
            onClick={scrollToProducts}
            className="bg-luxury-gold hover:bg-yellow-500 text-black font-semibold px-6 py-3"
          >
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}
