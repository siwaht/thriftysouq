import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter, Zap } from "lucide-react";
import type { Product } from "@/lib/types";

interface SmartFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  className?: string;
}

export function SmartFilters({ products, onFilterChange, className = "" }: SmartFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);

  // Get unique brands and price range from products
  const brands = [...new Set(products.map(p => p.brand))];
  const maxPrice = Math.max(...products.map(p => parseFloat(p.discountedPrice)));

  useEffect(() => {
    const filtered = products.filter(product => {
      const price = parseFloat(product.discountedPrice);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesDiscount = product.discount >= minDiscount;
      const matchesQuickFilter = quickFilters.length === 0 || 
        quickFilters.some(filter => {
          switch(filter) {
            case 'trending': return product.discount > 50;
            case 'luxury': return parseFloat(product.originalPrice) > 500;
            case 'deals': return product.discount > 60;
            case 'new': return product.id > 10; // Simulate new products
            default: return true;
          }
        });

      return matchesPrice && matchesBrand && matchesDiscount && matchesQuickFilter;
    });

    onFilterChange(filtered);
  }, [products, priceRange, selectedBrands, minDiscount, quickFilters, onFilterChange]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setMinDiscount(0);
    setQuickFilters([]);
  };

  const activeFiltersCount = selectedBrands.length + quickFilters.length + 
    (minDiscount > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Smart Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="outline" className="ml-2">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            onClick={clearAllFilters}
            variant="ghost" 
            size="sm"
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Quick Filters</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'trending', label: 'Trending', icon: '🔥' },
            { id: 'luxury', label: 'Luxury', icon: '💎' },
            { id: 'deals', label: 'Best Deals', icon: '⚡' },
            { id: 'new', label: 'New Arrivals', icon: '✨' }
          ].map(filter => (
            <Button
              key={filter.id}
              onClick={() => toggleQuickFilter(filter.id)}
              variant={quickFilters.includes(filter.id) ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                quickFilters.includes(filter.id) 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </p>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={maxPrice}
          step={10}
          className="w-full"
        />
      </div>

      {/* Minimum Discount */}
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Minimum Discount: {minDiscount}%
        </p>
        <Slider
          value={[minDiscount]}
          onValueChange={(value) => setMinDiscount(value[0])}
          max={80}
          step={5}
          className="w-full"
        />
      </div>

      {/* Brands */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Brands</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}