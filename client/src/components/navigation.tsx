import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Settings, Home, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import type { MenuItem } from "@shared/schema";

interface NavigationProps {
  onCartToggle: () => void;
}

export default function Navigation({ onCartToggle }: NavigationProps) {
  const [location] = useLocation();
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Add default "All" option
  const allCategories = [
    { id: 0, label: "All", value: "all", order: 0, isActive: true },
    ...menuItems.filter(item => item.isActive).sort((a, b) => a.order - b.order)
  ];

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    const event = new CustomEvent('filterProducts', { detail: category });
    window.dispatchEvent(event);
    setIsMobileMenuOpen(false);
  };

  const isAdminPage = location.includes('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 glass-dark shadow-modern-lg z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                LuxDeal <span className="text-emerald-400 font-light">Quick</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {!isAdminPage && allCategories.map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 mobile-tap ${
                  activeFilter === category.value 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" 
                    : "text-white/80 hover:text-white hover:bg-emerald-500/20"
                }`}
              >
                {category.label}
              </Button>
            ))}
            
            {isAdminPage && (
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-emerald-500/20 transition-all duration-300"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Store
                  </Button>
                </Link>
                <span className="text-white/60">|</span>
                <span className="text-white font-medium">Admin Panel</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/80 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Admin Link - Desktop */}
            <Link href="/admin" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Cart Button */}
            {!isAdminPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCartToggle}
                className="relative text-white/80 hover:text-white hover:bg-purple-500/20 transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-luxury-gold text-luxury-dark border-0"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-luxury-dark/95 backdrop-blur-xl border-t border-purple-500/20 shadow-2xl">
            <div className="p-4 space-y-2">
              {isAdminPage ? (
                <div className="space-y-2">
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-purple-500/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Store
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {allCategories.map((category) => (
                    <Button
                      key={category.value}
                      variant={activeFilter === category.value ? "default" : "ghost"}
                      className={`w-full justify-start transition-all duration-300 ${
                        activeFilter === category.value 
                          ? "bg-luxury-purple text-white shadow-lg" 
                          : "text-white/80 hover:text-white hover:bg-purple-500/20"
                      }`}
                      onClick={() => handleFilterChange(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                  
                  <div className="pt-2 border-t border-purple-500/20">
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-purple-500/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}