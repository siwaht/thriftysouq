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

  // Add default "All" option, filter out any "all" value from database to avoid duplicates
  const allCategories = [
    { id: 0, label: "All", value: "all", order: 0, isActive: true },
    ...menuItems.filter(item => item.isActive && item.value !== "all").sort((a, b) => a.order - b.order)
  ];

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    const event = new CustomEvent('filterProducts', { detail: category });
    window.dispatchEvent(event);
    setIsMobileMenuOpen(false);
    
    // Scroll to products section after a brief delay to allow filtering
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Reset filter to "all" when clicking logo
    if (activeFilter !== "all") {
      handleFilterChange("all");
    }
  };

  const isAdminPage = location.includes('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm shadow-lg z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              thrifty<span className="text-emerald-400 font-normal">souq</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {!isAdminPage && allCategories.slice(0, 6).map((category) => (
              <Button
                key={category.value}
                variant={activeFilter === category.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(category.value)}
                className={`text-white text-sm px-3 py-1 transition-colors ${
                  activeFilter === category.value ? 'bg-emerald-600' : 'hover:bg-slate-800'
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
              className="lg:hidden text-white/80 hover:text-white hover:bg-emerald-500/20 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Admin Link - Desktop */}
            <Link href="/admin" className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white hover:bg-emerald-500/20 transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            
            {!isAdminPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCartToggle}
                className="relative text-white hover:bg-slate-800 mobile-tap"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-dark border-t border-white/10 shadow-modern-lg">
            <div className="p-4 space-y-2">
              {isAdminPage ? (
                <div className="space-y-2">
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-emerald-500/20"
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
                          ? "bg-emerald-500 text-white shadow-lg" 
                          : "text-white/80 hover:text-white hover:bg-emerald-500/20"
                      }`}
                      onClick={() => handleFilterChange(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                  
                  <div className="pt-2 border-t border-white/10">
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-emerald-500/20"
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