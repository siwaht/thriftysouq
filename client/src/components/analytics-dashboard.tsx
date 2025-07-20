import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar,
  AlertTriangle,
  Star
} from "lucide-react";
import type { Product, Order } from "@shared/schema";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockItems: number;
  topSellingProducts: Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
  salesTrend: number;
  averageOrderValue: number;
}

export function AnalyticsDashboard() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Calculate analytics data
  const analyticsData: AnalyticsData = React.useMemo(() => {
    if (!products || !orders) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        lowStockItems: 0,
        topSellingProducts: [],
        recentOrders: [],
        salesTrend: 0,
        averageOrderValue: 0,
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock <= 5).length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate product sales from orders
    const productSales = new Map<number, { totalSold: number; revenue: number }>();
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const current = productSales.get(item.productId) || { totalSold: 0, revenue: 0 };
          productSales.set(item.productId, {
            totalSold: current.totalSold + item.quantity,
            revenue: current.revenue + (parseFloat(item.price) * item.quantity)
          });
        });
      }
    });

    // Top selling products
    const topSellingProducts = Array.from(productSales.entries())
      .map(([productId, sales]) => {
        const product = products.find(p => p.id === productId);
        return product ? { product, ...sales } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.totalSold - a!.totalSold)
      .slice(0, 5) as Array<{
        product: Product;
        totalSold: number;
        revenue: number;
      }>;

    // Recent orders (last 5)
    const recentOrders = [...orders]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    // Simple sales trend (comparing last 50% vs first 50% of orders)
    const midPoint = Math.floor(orders.length / 2);
    const firstHalfRevenue = orders.slice(0, midPoint).reduce((sum, order) => sum + parseFloat(order.total), 0);
    const secondHalfRevenue = orders.slice(midPoint).reduce((sum, order) => sum + parseFloat(order.total), 0);
    const salesTrend = firstHalfRevenue > 0 ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockItems,
      topSellingProducts,
      recentOrders,
      salesTrend,
      averageOrderValue,
    };
  }, [products, orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {formatCurrency(analyticsData.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.salesTrend > 0 ? '+' : ''}{analyticsData.salesTrend.toFixed(1)}% trend
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {analyticsData.totalOrders}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Avg: {formatCurrency(analyticsData.averageOrderValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {analyticsData.totalProducts}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Active inventory items
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {analyticsData.lowStockItems}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Items ≤ 5 units
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="luxury-card-shadow-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-luxury-purple" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topSellingProducts.length > 0 ? (
              analyticsData.topSellingProducts.map((item, index) => (
                <div key={item.product.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-luxury-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-luxury-black truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-luxury-purple">
                      {item.totalSold} sold
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No sales data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="luxury-card-shadow-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-luxury-purple" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.recentOrders.length > 0 ? (
              analyticsData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-luxury-black">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-center">
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-luxury-purple">
                      {formatCurrency(parseFloat(order.total))}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {analyticsData.lowStockItems > 0 && (
        <Card className="luxury-card-shadow-purple border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.filter(p => p.stock <= 5).map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-amber-600">
                      Only {product.stock} left
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Progress 
                      value={(product.stock / 10) * 100} 
                      className="w-12 h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}