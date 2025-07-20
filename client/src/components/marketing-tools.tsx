import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Calendar as CalendarIcon, 
  Percent,
  Gift,
  TrendingUp,
  Eye,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

const discountCodeSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20, "Code must be less than 20 characters"),
  description: z.string().min(1, "Description is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(1, "Discount value must be greater than 0"),
  minOrderValue: z.number().min(0, "Minimum order value cannot be negative"),
  maxUses: z.number().min(1, "Maximum uses must be at least 1"),
  expiresAt: z.date(),
  isActive: z.boolean(),
});

type DiscountCodeForm = z.infer<typeof discountCodeSchema>;

interface DiscountCode {
  id: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export function MarketingTools() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const form = useForm<DiscountCodeForm>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderValue: 0,
      maxUses: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  });

  // For demo purposes, using local state for discount codes
  // In production, this would be connected to your backend API
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    {
      id: 1,
      code: "LUXURY20",
      description: "20% off all luxury items",
      discountType: "percentage",
      discountValue: 20,
      minOrderValue: 500,
      maxUses: 100,
      currentUses: 23,
      expiresAt: "2025-02-20T00:00:00Z",
      isActive: true,
      createdAt: "2025-01-20T00:00:00Z",
    },
    {
      id: 2,
      code: "WELCOME50",
      description: "$50 off first purchase",
      discountType: "fixed",
      discountValue: 50,
      minOrderValue: 200,
      maxUses: 500,
      currentUses: 87,
      expiresAt: "2025-03-01T00:00:00Z",
      isActive: true,
      createdAt: "2025-01-15T00:00:00Z",
    },
    {
      id: 3,
      code: "FLASH70",
      description: "Flash sale - 70% off selected items",
      discountType: "percentage",
      discountValue: 70,
      minOrderValue: 0,
      maxUses: 50,
      currentUses: 45,
      expiresAt: "2025-01-25T23:59:59Z",
      isActive: false,
      createdAt: "2025-01-20T00:00:00Z",
    },
  ]);

  const handleSubmit = (data: DiscountCodeForm) => {
    if (editingCode) {
      // Update existing code
      setDiscountCodes(prev => prev.map(code => 
        code.id === editingCode.id 
          ? {
              ...code,
              ...data,
              expiresAt: data.expiresAt.toISOString(),
            }
          : code
      ));
      toast({
        title: "Discount Code Updated",
        description: `Code "${data.code}" has been updated successfully.`,
      });
    } else {
      // Create new code
      const newCode: DiscountCode = {
        id: Date.now(),
        ...data,
        currentUses: 0,
        expiresAt: data.expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      };
      setDiscountCodes(prev => [...prev, newCode]);
      toast({
        title: "Discount Code Created",
        description: `Code "${data.code}" has been created successfully.`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingCode(null);
    form.reset();
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    form.reset({
      code: code.code,
      description: code.description,
      discountType: code.discountType,
      discountValue: code.discountValue,
      minOrderValue: code.minOrderValue,
      maxUses: code.maxUses,
      expiresAt: new Date(code.expiresAt),
      isActive: code.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDiscountCodes(prev => prev.filter(code => code.id !== id));
    toast({
      title: "Discount Code Deleted",
      description: "The discount code has been deleted successfully.",
      variant: "destructive",
    });
  };

  const toggleActive = (id: number) => {
    setDiscountCodes(prev => prev.map(code => 
      code.id === id ? { ...code, isActive: !code.isActive } : code
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCodeStatus = (code: DiscountCode) => {
    const now = new Date();
    const expiresAt = new Date(code.expiresAt);
    const isExpired = now > expiresAt;
    const isMaxedOut = code.currentUses >= code.maxUses;
    
    if (isExpired) return { status: "Expired", color: "bg-red-100 text-red-800" };
    if (isMaxedOut) return { status: "Max Uses Reached", color: "bg-orange-100 text-orange-800" };
    if (!code.isActive) return { status: "Inactive", color: "bg-gray-100 text-gray-800" };
    return { status: "Active", color: "bg-green-100 text-green-800" };
  };

  const getUsagePercentage = (code: DiscountCode) => {
    return (code.currentUses / code.maxUses) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Marketing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {discountCodes.filter(code => code.isActive).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {discountCodes.length} total discount codes
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Gift className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {discountCodes.reduce((sum, code) => sum + code.currentUses, 0)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Across all campaigns
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card-shadow-purple">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
            <Percent className="h-4 w-4 text-luxury-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-luxury-black">
              {Math.round(
                discountCodes
                  .filter(code => code.discountType === "percentage")
                  .reduce((sum, code) => sum + code.discountValue, 0) /
                discountCodes.filter(code => code.discountType === "percentage").length || 0
              )}%
            </div>
            <div className="text-xs text-gray-600 mt-1">
              For percentage-based codes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discount Codes Management */}
      <Card className="luxury-card-shadow-purple">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-luxury-black">
              Discount Codes
            </CardTitle>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingCode(null);
                    form.reset();
                  }}
                  className="luxury-gradient-purple text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Discount Code
                </Button>
              </DialogTrigger>
              
              <DialogContent className="w-[95%] sm:max-w-2xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-luxury-black">
                    {editingCode ? "Edit Discount Code" : "Create New Discount Code"}
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Code</FormLabel>
                            <FormControl>
                              <Input placeholder="LUXURY20" {...field} className="uppercase" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the discount offer..."
                              rows={2}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Discount Value {form.watch("discountType") === "percentage" ? "(%)" : "($)"}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="20"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minOrderValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Order Value ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="100"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maxUses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Uses</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Expires At</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active</FormLabel>
                              <div className="text-sm text-gray-500">
                                Enable this discount code
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

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit" 
                        className="luxury-gradient-purple text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300"
                      >
                        {editingCode ? "Update Code" : "Create Code"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {discountCodes.map((code) => {
              const codeStatus = getCodeStatus(code);
              const usagePercentage = getUsagePercentage(code);
              
              return (
                <div key={code.id} className="border border-purple-100 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-luxury-black font-mono">
                          {code.code}
                        </h3>
                        <Badge className={`text-xs ${codeStatus.color}`}>
                          {codeStatus.status}
                        </Badge>
                        <Switch
                          checked={code.isActive}
                          onCheckedChange={() => toggleActive(code.id)}
                          size="sm"
                        />
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{code.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Discount</p>
                          <p className="font-semibold text-luxury-purple">
                            {code.discountType === "percentage" 
                              ? `${code.discountValue}%` 
                              : formatCurrency(code.discountValue)
                            }
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Min Order</p>
                          <p className="font-semibold">{formatCurrency(code.minOrderValue)}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Usage</p>
                          <p className="font-semibold">
                            {code.currentUses} / {code.maxUses}
                            <span className="text-xs text-gray-500 ml-1">
                              ({usagePercentage.toFixed(0)}%)
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Expires</p>
                          <p className="font-semibold text-xs">
                            {format(new Date(code.expiresAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(code)}
                        size="sm"
                        variant="outline"
                        className="p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(code.id)}
                        size="sm"
                        variant="destructive"
                        className="p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Usage Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Usage Progress</span>
                      <span>{usagePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-luxury-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {discountCodes.length === 0 && (
              <div className="text-center py-12">
                <Tag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No discount codes yet</h3>
                <p className="text-gray-500 mb-6">Create your first discount code to start marketing campaigns.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}