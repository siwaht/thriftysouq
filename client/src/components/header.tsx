import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">
              LuxDeal <span className="text-luxury-gold">Quick</span>
            </h1>
            <span className="ml-3 text-sm text-gray-600 hidden sm:block">
              Luxury at Lightning Speed
            </span>
          </div>

          {/* Category Filters - Desktop */}
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={activeFilter === category.value ? "bg-black text-white" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartToggle}
              className="relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-luxury-gold text-black px-1 min-w-[1.25rem] h-5 rounded-full text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Category Filters */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={`whitespace-nowrap ${
                  activeFilter === category.value ? "bg-black text-white" : ""
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
