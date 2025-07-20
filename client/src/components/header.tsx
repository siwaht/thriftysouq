import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Settings } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Link } from "wouter";

const categories = [
  { value: "all", label: "All" },
  { value: "watches", label: "Watches" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "jewelry", label: "Jewelry" },
  { value: "bags", label: "Bags" },
  { value: "wallets", label: "Wallets" },
];

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const { cartItems } = useCart();
  const [activeFilter, setActiveFilter] = useState("all");
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    const event = new CustomEvent('filterProducts', { detail: category });
    window.dispatchEvent(event);
  };

  return (
    <header className="fixed top-0 left-0 right-0 luxury-backdrop shadow-2xl z-50 border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              LuxDeal <span className="text-luxury-gold font-light">Quick</span>
            </h1>
          </div>

          {/* Category Filters - Desktop */}
          <div className="hidden md:flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category.value 
                    ? "bg-luxury-purple text-white shadow-lg shadow-purple-500/25" 
                    : "text-white/80 hover:text-white hover:bg-purple-500/20"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Admin & Cart Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartToggle}
              className="relative hover:bg-purple-500/20 transition-colors p-3"
            >
              <ShoppingBag className="h-6 w-6 text-white" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-luxury-gold text-black px-2 min-w-[1.25rem] h-6 rounded-full text-xs font-semibold shadow-lg">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Category Filters */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-2 -mx-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={`whitespace-nowrap mobile-optimized flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === category.value 
                    ? "bg-luxury-purple text-white shadow-lg shadow-purple-500/25" 
                    : "text-white/80 hover:text-white hover:bg-purple-500/20"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
