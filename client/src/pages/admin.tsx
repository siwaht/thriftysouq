import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Plus, Package, Menu, ClipboardList, Calendar, DollarSign, CheckCircle, Clock, XCircle, Eye, Webhook, TestTube, LogOut, BarChart3, Tag, Upload, Download, FileText, MapPin, Users, Server } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { HeroBannerAdmin } from "@/components/hero-banner-admin";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { MarketingTools } from "@/components/marketing-tools";
import { WebhookTester } from "@/components/webhook-tester";
import { MCPManagement } from "@/components/mcp-management";
import AdminPaymentSettings from "./admin-payment-settings";

import type { Product, MenuItem, Webhook as WebhookType } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["watches", "jewelry", "fashion", "accessories", "beauty"]),
  originalPrice: z.string().min(1, "Original price is required"),
  discountedPrice: z.string().min(1, "Discounted price is required"),
  discount: z.number().min(1).max(99),
  image: z.string().url("Must be a valid URL"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

const menuItemFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  order: z.number().min(0, "Order cannot be negative"),
  isActive: z.boolean(),
});

const webhookFormSchema = z.object({
  name: z.string().min(1, "Webhook name is required"),
  url: z.string().url("Must be a valid URL"),
  events: z.array(z.string()).min(1, "At least one event must be selected"),
  isActive: z.boolean(),
  secret: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;
type MenuItemFormData = z.infer<typeof menuItemFormSchema>;
type WebhookFormData = z.infer<typeof webhookFormSchema>;

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<WebhookType | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isOrderImportDialogOpen, setIsOrderImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [orderImportFile, setOrderImportFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [orderImportResults, setOrderImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [isOrderDetailDialogOpen, setIsOrderDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: menuItems = [], isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: webhooks = [], isLoading: webhooksLoading } = useQuery<WebhookType[]>({
    queryKey: ["/api/admin/webhooks"],
  });

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "watches",
      originalPrice: "",
      discountedPrice: "",
      discount: 0,
      image: "",
      stock: 0,
    },
  });

  const menuForm = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      label: "",
      value: "",
      order: 0,
      isActive: true,
    },
  });

  const webhookForm = useForm<WebhookFormData>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: "",
      url: "",
      events: [],
      isActive: true,
      secret: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      return await apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      productForm.reset();
      toast({
        title: "Product created successfully",
        description: "The new product has been added to your inventory.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error creating product",
        description: "There was an error creating the product. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData & { id: number }) => {
      return await apiRequest(`/api/admin/products/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      toast({
        title: "Product updated successfully",
        description: "The product has been updated.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error updating product",
        description: "There was an error updating the product. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from your inventory.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error deleting product",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  // Menu item mutations
  const createMenuItemMutation = useMutation({
    mutationFn: async (menuData: MenuItemFormData) => {
      return await apiRequest("/api/admin/menu-items", {
        method: "POST",
        body: JSON.stringify(menuData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsMenuDialogOpen(false);
      menuForm.reset();
      toast({
        title: "Success",
        description: "Menu item created successfully",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async (data: MenuItemFormData & { id: number }) => {
      const { id, ...menuData } = data;
      return await apiRequest(`/api/admin/menu-items/${id}`, {
        method: "PUT",
        body: JSON.stringify(menuData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsMenuDialogOpen(false);
      setEditingMenuItem(null);
      menuForm.reset();
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (menuItemId: number) => {
      return await apiRequest(`/api/admin/menu-items/${menuItemId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    },
  });

  // Order status update mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return await apiRequest(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order status updated",
        description: "The order status has been updated successfully.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error updating order",
        description: "There was an error updating the order status.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  // Webhook mutations
  const createWebhookMutation = useMutation({
    mutationFn: async (data: WebhookFormData) => {
      return await apiRequest("/api/admin/webhooks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webhooks"] });
      setIsWebhookDialogOpen(false);
      webhookForm.reset();
      toast({
        title: "Webhook created successfully",
        description: "The webhook has been configured and is ready to receive events.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error creating webhook",
        description: "Failed to create webhook. Please check the URL and try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const updateWebhookMutation = useMutation({
    mutationFn: async (data: WebhookFormData & { id: number }) => {
      return await apiRequest(`/api/admin/webhooks/${data.id}`, {
        method: "PUT", 
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webhooks"] });
      setIsWebhookDialogOpen(false);
      setEditingWebhook(null);
      webhookForm.reset();
      toast({
        title: "Webhook updated successfully",
        description: "The webhook configuration has been updated.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error updating webhook",
        description: "Failed to update webhook. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (webhookId: number) => {
      return await apiRequest(`/api/admin/webhooks/${webhookId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/webhooks"] });
      toast({
        title: "Webhook deleted successfully",
        description: "The webhook has been removed.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Error deleting webhook",
        description: "Failed to delete webhook. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (webhookId: number) => {
      return await apiRequest(`/api/admin/webhooks/${webhookId}/test`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Test webhook sent",
        description: "A test payload has been sent to the webhook URL.",
        duration: 2000,
      });
    },
    onError: () => {
      toast({
        title: "Test failed",
        description: "Failed to send test webhook. Please check the URL and try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });



  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ ...data, id: editingProduct.id });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const onMenuSubmit = (data: MenuItemFormData) => {
    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ ...data, id: editingMenuItem.id });
    } else {
      createMenuItemMutation.mutate(data);
    }
  };

  const onWebhookSubmit = (data: WebhookFormData) => {
    if (editingWebhook) {
      updateWebhookMutation.mutate({ ...data, id: editingWebhook.id });
    } else {
      createWebhookMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      brand: product.brand,
      category: product.category as any,
      originalPrice: product.originalPrice,
      discountedPrice: product.discountedPrice,
      discount: product.discount,
      image: product.image,
      stock: product.stock,
    });
    setIsProductDialogOpen(true);
  };

  const handleDelete = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    productForm.reset();
    setIsProductDialogOpen(true);
  };

  // Menu item handlers
  const handleMenuEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    menuForm.reset({
      label: menuItem.label,
      value: menuItem.value,
      order: menuItem.order,
      isActive: menuItem.isActive,
    });
    setIsMenuDialogOpen(true);
  };

  const handleMenuDelete = (menuItemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItemMutation.mutate(menuItemId);
    }
  };

  const handleAddNewMenu = () => {
    setEditingMenuItem(null);
    menuForm.reset();
    setIsMenuDialogOpen(true);
  };

  // Webhook handlers
  const handleWebhookEdit = (webhook: WebhookType) => {
    setEditingWebhook(webhook);
    webhookForm.reset({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      secret: webhook.secret || "",
    });
    setIsWebhookDialogOpen(true);
  };

  const handleWebhookDelete = (webhookId: number) => {
    if (confirm("Are you sure you want to delete this webhook?")) {
      deleteWebhookMutation.mutate(webhookId);
    }
  };

  const handleWebhookAddNew = () => {
    setEditingWebhook(null);
    webhookForm.reset();
    setIsWebhookDialogOpen(true);
  };

  const handleWebhookTest = (webhookId: number) => {
    testWebhookMutation.mutate(webhookId);
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailDialogOpen(true);
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/admin/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      window.location.href = "/admin-login";
    },
    onError: () => {
      toast({
        title: "Logout Error",
        description: "There was an error logging out",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Bulk import/export functions
  const handleExportProducts = () => {
    if (!products.length) {
      toast({
        title: "No products to export",
        description: "Add some products first before exporting.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const csvHeaders = ["name", "brand", "category", "originalPrice", "discountedPrice", "discount", "image", "stock"];
    const csvRows = products.map(product => [
      product.name,
      product.brand,
      product.category,
      product.originalPrice,
      product.discountedPrice,
      product.discount,
      product.image,
      product.stock
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `products-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Products exported",
      description: `Successfully exported ${products.length} products to CSV.`,
      duration: 2000,
    });
  };

  const handleImportProducts = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      const text = await importFile.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Invalid file",
          description: "CSV file must contain headers and at least one product row.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
      const expectedHeaders = ["name", "brand", "category", "originalPrice", "discountedPrice", "discount", "image", "stock"];
      
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        toast({
          title: "Invalid CSV format",
          description: `Missing required columns: ${missingHeaders.join(", ")}`,
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const productData = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(",").map(v => v.replace(/"/g, "").trim());
          const product: any = {};
          
          headers.forEach((header, index) => {
            product[header] = values[index] || "";
          });

          // Validate and convert data types
          product.discount = parseInt(product.discount);
          product.stock = parseInt(product.stock);

          if (!product.name || !product.brand || !product.category || 
              !product.originalPrice || !product.discountedPrice ||
              isNaN(product.discount) || isNaN(product.stock)) {
            errors.push(`Row ${i + 1}: Invalid or missing required fields`);
            continue;
          }

          if (!["watches", "jewelry", "fashion", "accessories", "beauty"].includes(product.category)) {
            errors.push(`Row ${i + 1}: Invalid category "${product.category}"`);
            continue;
          }

          productData.push(product);
        } catch (error) {
          errors.push(`Row ${i + 1}: Failed to parse data`);
        }
      }

      if (productData.length === 0) {
        setImportResults({ success: 0, errors });
        return;
      }

      // Import products via API
      const response = await apiRequest("/api/admin/products/bulk-import", {
        method: "POST",
        body: JSON.stringify({ products: productData }),
      });

      const result = await response.json();
      setImportResults({
        success: result.success || productData.length,
        errors: [...errors, ...(result.errors || [])]
      });

      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.success || productData.length} products.`,
        duration: 2000,
      });

    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to process the CSV file. Please check the format and try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ["name", "brand", "category", "originalPrice", "discountedPrice", "discount", "image", "stock"],
      ["Sample Watch", "Luxury Brand", "watches", "$2,000", "$800", "60", "https://example.com/watch.jpg", "10"],
      ["Sample Ring", "Premium Jewelry", "jewelry", "$1,500", "$750", "50", "https://example.com/ring.jpg", "5"]
    ];

    const csvContent = sampleData
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "products-import-sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadOrderSampleCSV = () => {
    const sampleData = [
      ["customerName", "customerEmail", "customerPhone", "shippingAddress", "city", "postalCode", "specialInstructions", "paymentMethod", "total", "status", "items"],
      ["John Doe", "john@example.com", "+971-50-123-4567", "123 Sheikh Zayed Road", "Dubai", "12345", "Handle with care", "card", "5500.50", "pending", '[{"productId": 1, "quantity": 2, "price": "2750.25"}]'],
      ["Jane Smith", "jane@example.com", "+971-52-987-6543", "456 Al Wasl Road", "Dubai", "67890", "", "cash", "3200.00", "processing", '[{"productId": 2, "quantity": 1, "price": "3200.00"}]']
    ];

    const csvContent = sampleData
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders-import-sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportOrders = async () => {
    if (!orderImportFile) return;

    try {
      const text = await orderImportFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const ordersData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const order: any = {};
        
        headers.forEach((header, index) => {
          let value = values[index] || '';
          
          if (header === 'items') {
            try {
              order[header] = JSON.parse(value);
            } catch {
              order[header] = [];
            }
          } else if (header === 'total') {
            order[header] = parseFloat(value) || 0;
          } else {
            order[header] = value;
          }
        });
        
        return order;
      });

      const response = await apiRequest("/api/admin/orders/import", {
        method: "POST",
        body: JSON.stringify({ orders: ordersData }),
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await response.json();
      setOrderImportResults(result.results);

      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.results.success} orders.`,
        duration: 2000,
      });

    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to process the CSV file. Please check the format and try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleExportOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders/export", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        const headers = Object.keys(result.data[0] || {});
        const csvData = [
          headers,
          ...result.data.map((order: any) => headers.map(header => order[header] || ''))
        ];

        const csvContent = csvData
          .map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(","))
          .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Export completed",
          description: `Successfully exported ${result.count} orders.`,
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export orders.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  // If not authenticated, the useAdminAuth hook will redirect to login
  if (!isAuthenticated) {
    return null;
  }

  if (productsLoading || menuLoading || webhooksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-violet-50/30">
        <Navigation onCartToggle={() => {}} />
        <div className="pt-24 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-purple-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-white to-violet-50/30">
      <Navigation onCartToggle={() => {}} />
      
      <div className="pt-24 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-luxury-black mb-2">
                Admin <span className="text-luxury-purple font-normal">Dashboard</span>
              </h1>
              <p className="text-gray-600">Manage your luxury store, navigation, and orders</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 mb-8 h-auto">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <BarChart3 className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="marketing" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Tag className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Marketing</span>
                <span className="sm:hidden">Promo</span>
              </TabsTrigger>
              <TabsTrigger value="hero" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Eye className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Hero Banner</span>
                <span className="sm:hidden">Hero</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Package className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Products</span>
                <span className="sm:hidden">Items</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <ClipboardList className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Orders</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Menu className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Navigation Menu</span>
                <span className="sm:hidden">Menu</span>
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Webhook className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Webhooks</span>
                <span className="sm:hidden">API</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <DollarSign className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">Payments</span>
                <span className="sm:hidden">Pay</span>
              </TabsTrigger>
              <TabsTrigger value="mcp" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white flex-col sm:flex-row p-2 sm:p-3 text-xs sm:text-sm h-auto min-h-[44px]">
                <Server className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2" />
                <span className="hidden sm:inline">MCP Server</span>
                <span className="sm:hidden">MCP</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="marketing">
              <MarketingTools />
            </TabsContent>

            <TabsContent value="hero">
              <HeroBannerAdmin />
            </TabsContent>

            <TabsContent value="products">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-light text-luxury-black mb-2">
                    Product <span className="text-luxury-purple font-normal">Management</span>
                  </h2>
                  <p className="text-gray-600">Add, edit, and manage your luxury products</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={downloadSampleCSV}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Sample CSV
                  </Button>
                  
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="w-[95%] sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Import Products from CSV</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Select CSV File
                            </label>
                            <Input
                              type="file"
                              accept=".csv"
                              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                              className="cursor-pointer"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Upload a CSV file with product data. Required columns: name, brand, category, originalPrice, discountedPrice, discount, image, stock
                            </p>
                          </div>
                          
                          {importFile && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700">
                                File selected: {importFile.name} ({Math.round(importFile.size / 1024)}KB)
                              </p>
                            </div>
                          )}
                          
                          {importResults && (
                            <div className="space-y-2">
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700 font-medium">
                                  Import Results:
                                </p>
                                <p className="text-sm text-blue-600">
                                  Successfully imported: {importResults.success} products
                                </p>
                              </div>
                              
                              {importResults.errors.length > 0 && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-y-auto">
                                  <p className="text-sm text-red-700 font-medium mb-1">Errors:</p>
                                  <ul className="text-sm text-red-600 space-y-1">
                                    {importResults.errors.map((error, index) => (
                                      <li key={index}>• {error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleImportProducts}
                            disabled={!importFile}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Import Products
                          </Button>
                          
                          <Button
                            onClick={downloadSampleCSV}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Download Sample
                          </Button>
                          
                          <Button
                            onClick={() => {
                              setIsImportDialogOpen(false);
                              setImportFile(null);
                              setImportResults(null);
                            }}
                            variant="outline"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    onClick={handleExportProducts}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!products.length}
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleAddNew}
                      className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
              
              <DialogContent className="w-[95%] sm:max-w-2xl max-h-[95vh] overflow-y-auto mobile-optimized">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-light text-luxury-dark">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...productForm}>
                  <form onSubmit={productForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Luxury Watch Name" className="mobile-optimized" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="Rolex" className="mobile-optimized" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="mobile-optimized">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="watches">Watches</SelectItem>
                                <SelectItem value="jewelry">Jewelry</SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                                <SelectItem value="beauty">Beauty</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original Price</FormLabel>
                            <FormControl>
                              <Input placeholder="1999.99" className="mobile-optimized" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="discountedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price</FormLabel>
                            <FormControl>
                              <Input placeholder="999.99" className="mobile-optimized" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount %</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="50" 
                                className="mobile-optimized"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="10" 
                                className="mobile-optimized"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={productForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" className="mobile-optimized" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        type="submit" 
                        className="luxury-gradient-purple text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      >
                        {editingProduct ? "Update Product" : "Create Product"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsProductDialogOpen(false)}
                        className="mobile-optimized"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 admin-card-grid">
            {products.map((product) => (
              <Card key={product.id} className="luxury-card-shadow-purple border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 sm:h-40 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-luxury-purple text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-luxury-purple uppercase tracking-wider">{product.brand}</p>
                    <h3 className="font-semibold text-sm text-luxury-black line-clamp-2">{product.name}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-luxury-purple">AED {parseFloat(product.discountedPrice).toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">AED {parseFloat(product.originalPrice).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="text-sm font-semibold">{product.stock}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 mobile-button-spacing">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1 mobile-optimized mobile-touch-target"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      variant="destructive"
                      className="flex-1 mobile-optimized mobile-touch-target"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first luxury product.</p>
              <Button 
                onClick={handleAddNew}
                className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          )}
            </TabsContent>

            <TabsContent value="menu">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-light text-luxury-black mb-2">
                    Navigation <span className="text-luxury-purple font-normal">Menu</span>
                  </h2>
                  <p className="text-gray-600">Manage navigation categories and order</p>
                </div>
                
                <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleAddNewMenu}
                      className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="w-[95%] sm:max-w-lg max-h-[95vh] overflow-y-auto mobile-optimized">
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl font-light text-luxury-dark">
                        {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <Form {...menuForm}>
                      <form onSubmit={menuForm.handleSubmit(onMenuSubmit)} className="space-y-4 sm:space-y-6">
                        <FormField
                          control={menuForm.control}
                          name="label"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Label</FormLabel>
                              <FormControl>
                                <Input placeholder="Watches" className="mobile-optimized" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={menuForm.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Value</FormLabel>
                              <FormControl>
                                <Input placeholder="watches" className="mobile-optimized" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={menuForm.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="1" 
                                  className="mobile-optimized"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={menuForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Active</FormLabel>
                                <div className="text-sm text-gray-500">
                                  Show this menu item in navigation
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button 
                            type="submit" 
                            className="luxury-gradient-purple text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                            disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                          >
                            {editingMenuItem ? "Update Menu Item" : "Create Menu Item"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsMenuDialogOpen(false)}
                            className="mobile-optimized"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 admin-card-grid">
                {menuItems.map((menuItem) => (
                  <Card key={menuItem.id} className="luxury-card-shadow-purple border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-luxury-black">{menuItem.label}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">#{menuItem.order}</span>
                          <Switch checked={menuItem.isActive} disabled />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Category Value</p>
                        <p className="text-sm font-mono text-luxury-purple">{menuItem.value}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 mobile-button-spacing">
                        <Button
                          onClick={() => handleMenuEdit(menuItem)}
                          size="sm"
                          variant="outline"
                          className="flex-1 mobile-optimized mobile-touch-target"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleMenuDelete(menuItem.id)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 mobile-optimized mobile-touch-target"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {menuItems.length === 0 && (
                <div className="text-center py-12">
                  <Menu className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
                  <p className="text-gray-500 mb-6">Create navigation categories for your store.</p>
                  <Button 
                    onClick={handleAddNewMenu}
                    className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Menu Item
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-light text-luxury-black mb-2">
                    Order <span className="text-luxury-purple font-normal">Management</span>
                  </h2>
                  <p className="text-gray-600">View and manage customer orders</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={downloadOrderSampleCSV}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Sample CSV
                  </Button>
                  
                  <Dialog open={isOrderImportDialogOpen} onOpenChange={setIsOrderImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="w-[95%] sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Import Orders from CSV</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Select CSV File
                            </label>
                            <Input
                              type="file"
                              accept=".csv"
                              onChange={(e) => setOrderImportFile(e.target.files?.[0] || null)}
                              className="cursor-pointer"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Upload a CSV file with order data. Required columns: customerName, customerEmail, customerPhone, shippingAddress, city, paymentMethod, total, items (JSON array)
                            </p>
                          </div>
                          
                          {orderImportFile && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700">
                                File selected: {orderImportFile.name} ({Math.round(orderImportFile.size / 1024)}KB)
                              </p>
                            </div>
                          )}
                          
                          {orderImportResults && (
                            <div className="space-y-2">
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700 font-medium">
                                  Import Results:
                                </p>
                                <p className="text-sm text-blue-600">
                                  Successfully imported: {orderImportResults.success} orders
                                </p>
                              </div>
                              
                              {orderImportResults.errors.length > 0 && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-y-auto">
                                  <p className="text-sm text-red-700 font-medium mb-1">Errors:</p>
                                  <ul className="text-sm text-red-600 space-y-1">
                                    {orderImportResults.errors.map((error, index) => (
                                      <li key={index}>• {error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={handleImportOrders}
                            disabled={!orderImportFile}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Import Orders
                          </Button>
                          
                          <Button
                            onClick={downloadOrderSampleCSV}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Download Sample
                          </Button>
                          
                          <Button
                            onClick={() => {
                              setIsOrderImportDialogOpen(false);
                              setOrderImportFile(null);
                              setOrderImportResults(null);
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    onClick={handleExportOrders}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {ordersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-32 bg-purple-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {!Array.isArray(orders) || orders.length === 0 ? (
                    <Card className="p-8 text-center">
                      <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                    </Card>
                  ) : (
                    Array.isArray(orders) && orders.map((order: any) => (
                      <Card key={order.id} className="luxury-card-shadow-purple border border-purple-100/50">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <div className="bg-purple-100 p-2 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-luxury-black">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-500">{order.customerName}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="font-bold text-luxury-purple">AED {parseFloat(order.total).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status === 'pending' && <Clock className="h-3 w-3" />}
                                  {order.status === 'processing' && <Clock className="h-3 w-3" />}
                                  {order.status === 'shipped' && <Package className="h-3 w-3" />}
                                  {order.status === 'delivered' && <CheckCircle className="h-3 w-3" />}
                                  {order.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                                <Select 
                                  value={order.status} 
                                  onValueChange={(newStatus) => updateOrderStatusMutation.mutate({ orderId: order.id, status: newStatus })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">Customer Information</h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-gray-500">Email:</span> {order.customerEmail}</p>
                                <p><span className="text-gray-500">Phone:</span> {order.customerPhone}</p>
                                <p><span className="text-gray-500">Payment:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-700 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">{order.shippingAddress}, {order.city} {order.postalCode}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 border-t border-gray-100">
                            <Button
                              onClick={() => handleViewOrderDetails(order)}
                              variant="outline"
                              className="flex items-center gap-2 mobile-touch-target"
                            >
                              <Eye className="w-4 h-4" />
                              View Full Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>

            {/* Order Details Modal */}
            <Dialog open={isOrderDetailDialogOpen} onOpenChange={setIsOrderDetailDialogOpen}>
              <DialogContent className="w-[95%] sm:max-w-4xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-light text-luxury-dark">
                    Order Details - {selectedOrder?.orderNumber}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedOrder && (
                  <div className="space-y-6">
                    {/* Order Status and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium ${
                            selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedOrder.status === 'pending' && <Clock className="h-4 w-4" />}
                            {selectedOrder.status === 'processing' && <Clock className="h-4 w-4" />}
                            {selectedOrder.status === 'shipped' && <Package className="h-4 w-4" />}
                            {selectedOrder.status === 'delivered' && <CheckCircle className="h-4 w-4" />}
                            {selectedOrder.status === 'cancelled' && <XCircle className="h-4 w-4" />}
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </div>
                          <div className="text-2xl font-bold text-luxury-purple">
                            AED {parseFloat(selectedOrder.total).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Order placed: {new Date(selectedOrder.createdAt || Date.now()).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select 
                          value={selectedOrder.status} 
                          onValueChange={(newStatus) => {
                            updateOrderStatusMutation.mutate({ orderId: selectedOrder.id, status: newStatus });
                            setSelectedOrder({...selectedOrder, status: newStatus});
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-luxury-purple" />
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Name</p>
                            <p className="text-sm text-gray-900">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-sm text-gray-900">{selectedOrder.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Phone</p>
                            <p className="text-sm text-gray-900">{selectedOrder.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Payment Method</p>
                            <p className="text-sm text-gray-900">
                              {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-luxury-purple" />
                            Shipping Address
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Address</p>
                            <p className="text-sm text-gray-900">{selectedOrder.shippingAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">City</p>
                            <p className="text-sm text-gray-900">{selectedOrder.city}</p>
                          </div>
                          {selectedOrder.postalCode && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Postal Code</p>
                              <p className="text-sm text-gray-900">{selectedOrder.postalCode}</p>
                            </div>
                          )}
                          {selectedOrder.specialInstructions && (
                            <div>
                              <p className="text-sm font-medium text-gray-700">Special Instructions</p>
                              <p className="text-sm text-gray-900">{selectedOrder.specialInstructions}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-luxury-purple" />
                          Order Items ({selectedOrder.items?.length || 0} items)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          <div className="space-y-4">
                            {selectedOrder.items.map((item: any, index: number) => (
                              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                <img 
                                  src={item.product?.image || '/placeholder.jpg'} 
                                  alt={item.product?.name || 'Product'} 
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                                    <p className="text-sm text-gray-600">{item.product?.brand || 'Unknown Brand'}</p>
                                    <p className="text-xs text-gray-500">Category: {item.product?.category || 'N/A'}</p>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                    <span className="text-gray-600">Unit Price: AED {parseFloat(item.price).toFixed(2)}</span>
                                    <span className="font-semibold text-luxury-purple">
                                      Total: AED {(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="border-t pt-4 mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Order Total:</span>
                                <span className="text-xl font-bold text-luxury-purple">
                                  AED {parseFloat(selectedOrder.total).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No items found for this order</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <TabsContent value="webhooks">
              <WebhookTester />
              
              <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-light text-luxury-black mb-2">
                    Webhook <span className="text-luxury-purple font-normal">Management</span>
                  </h2>
                  <p className="text-gray-600">Configure webhooks for automation platforms like n8n and Make.com</p>
                </div>

                <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleWebhookAddNew}
                      className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="w-[95%] sm:max-w-2xl max-h-[95vh] overflow-y-auto mobile-optimized">
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl font-light text-luxury-dark">
                        {editingWebhook ? "Edit Webhook" : "Add New Webhook"}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <Form {...webhookForm}>
                      <form onSubmit={webhookForm.handleSubmit(onWebhookSubmit)} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={webhookForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-luxury-dark font-medium">Webhook Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., n8n Order Processing"
                                    className="border-gray-300 focus:border-luxury-purple mobile-optimized"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={webhookForm.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-luxury-dark font-medium">Webhook URL</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="url"
                                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                                    className="border-gray-300 focus:border-luxury-purple mobile-optimized"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={webhookForm.control}
                            name="events"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-luxury-dark font-medium">Events to Listen For</FormLabel>
                                <div className="space-y-2">
                                  {[
                                    { value: 'order.created', label: 'Order Created' },
                                    { value: 'order.status_changed', label: 'Order Status Changed' },
                                    { value: 'webhook.test', label: 'Webhook Test' }
                                  ].map((event) => (
                                    <div key={event.value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={event.value}
                                        checked={field.value?.includes(event.value)}
                                        onCheckedChange={(checked) => {
                                          const currentEvents = field.value || [];
                                          if (checked) {
                                            field.onChange([...currentEvents, event.value]);
                                          } else {
                                            field.onChange(currentEvents.filter(e => e !== event.value));
                                          }
                                        }}
                                      />
                                      <label 
                                        htmlFor={event.value}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {event.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={webhookForm.control}
                            name="secret"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-luxury-dark font-medium">Secret Key (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password"
                                    placeholder="Optional secret for webhook verification"
                                    className="border-gray-300 focus:border-luxury-purple mobile-optimized"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={webhookForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-luxury-dark font-medium">Active Webhook</FormLabel>
                                  <div className="text-sm text-gray-600">
                                    Enable or disable this webhook
                                  </div>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsWebhookDialogOpen(false)}
                            className="sm:flex-1 mobile-optimized"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="sm:flex-1 luxury-gradient-purple text-white mobile-optimized"
                            disabled={createWebhookMutation.isPending || updateWebhookMutation.isPending}
                          >
                            {createWebhookMutation.isPending || updateWebhookMutation.isPending ? "Saving..." : (editingWebhook ? "Update Webhook" : "Create Webhook")}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {webhooks.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Webhook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Webhooks Configured</h3>
                        <p className="text-gray-500 mb-4">Connect your automation platforms to receive real-time order updates.</p>
                        <Button onClick={handleWebhookAddNew} className="luxury-gradient-purple text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Webhook
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  webhooks.map((webhook) => (
                    <Card key={webhook.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-luxury-dark">{webhook.name}</h3>
                          <p className="text-sm text-gray-600 break-all">{webhook.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={webhook.isActive ? "default" : "secondary"} className="text-xs">
                            {webhook.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">Events</h4>
                            <div className="flex flex-wrap gap-2">
                              {webhook.events.map((event) => (
                                <Badge key={event} variant="outline" className="text-xs">
                                  {event.replace('_', ' ').replace('.', ': ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWebhookTest(webhook.id)}
                              disabled={testWebhookMutation.isPending}
                              className="flex-1"
                            >
                              <TestTube className="w-4 h-4 mr-2" />
                              {testWebhookMutation.isPending ? "Testing..." : "Test Webhook"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWebhookEdit(webhook)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleWebhookDelete(webhook.id)}
                              className="flex-1"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <AdminPaymentSettings />
            </TabsContent>

            <TabsContent value="mcp">
              <MCPManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}