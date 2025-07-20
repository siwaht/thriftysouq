import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Package, Menu } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import type { Product, MenuItem } from "@shared/schema";

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

type ProductFormData = z.infer<typeof productFormSchema>;
type MenuItemFormData = z.infer<typeof menuItemFormSchema>;

export default function AdminPage() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: menuItems = [], isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
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

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("POST", "/api/admin/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      productForm.reset();
      toast({
        title: "Product created successfully",
        description: "The new product has been added to your inventory.",
      });
    },
    onError: () => {
      toast({
        title: "Error creating product",
        description: "There was an error creating the product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData & { id: number }) => {
      const response = await apiRequest("PUT", `/api/admin/products/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      toast({
        title: "Product updated successfully",
        description: "The product has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating product",
        description: "There was an error updating the product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/admin/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from your inventory.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting product",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Menu item mutations
  const createMenuItemMutation = useMutation({
    mutationFn: async (menuData: MenuItemFormData) => {
      const response = await apiRequest("POST", "/api/admin/menu-items", menuData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsMenuDialogOpen(false);
      menuForm.reset();
      toast({
        title: "Success",
        description: "Menu item created successfully",
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
      const response = await apiRequest("PUT", `/api/admin/menu-items/${id}`, menuData);
      return response.json();
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
      await apiRequest("DELETE", `/api/admin/menu-items/${menuItemId}`);
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

  if (productsLoading || menuLoading) {
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
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-light text-luxury-black mb-2">
              Admin <span className="text-luxury-purple font-normal">Dashboard</span>
            </h1>
            <p className="text-gray-600">Manage your luxury store and navigation</p>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="menu" className="data-[state=active]:bg-luxury-purple data-[state=active]:text-white">
                <Menu className="w-4 h-4 mr-2" />
                Navigation Menu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-light text-luxury-black mb-2">
                    Product <span className="text-luxury-purple font-normal">Management</span>
                  </h2>
                  <p className="text-gray-600">Add, edit, and manage your luxury products</p>
                </div>
            
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleAddNew}
                  className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 mobile-optimized"
                >
                  <Plus className="w-4 h-4 mr-2" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                      <p className="text-lg font-bold text-luxury-purple">${parseFloat(product.discountedPrice).toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">${parseFloat(product.originalPrice).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className="text-sm font-semibold">{product.stock}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1 mobile-optimized"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      variant="destructive"
                      className="flex-1 mobile-optimized"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleMenuEdit(menuItem)}
                          size="sm"
                          variant="outline"
                          className="flex-1 mobile-optimized"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleMenuDelete(menuItem.id)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 mobile-optimized"
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}