import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Trash2, Plus, Eye, EyeOff } from "lucide-react";

interface PaymentCredential {
  id: number;
  provider: string;
  keyType: string;
  keyValue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const credentialSchema = z.object({
  provider: z.enum(["stripe", "paypal"]),
  keyType: z.string().min(1, "Key type is required"),
  keyValue: z.string().min(1, "Key value is required"),
  isActive: z.boolean().default(true),
});

type CredentialForm = z.infer<typeof credentialSchema>;

export default function AdminPaymentSettings() {
  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: credentials = [], isLoading } = useQuery<PaymentCredential[]>({
    queryKey: ["/api/admin/payment-credentials"],
  });

  const form = useForm<CredentialForm>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      provider: "stripe",
      keyType: "",
      keyValue: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CredentialForm) => {
      return await apiRequest("POST", "/api/admin/payment-credentials", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-credentials"] });
      form.reset();
      toast({
        title: "Success",
        description: "Payment credential saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save payment credential",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/payment-credentials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-credentials"] });
      toast({
        title: "Success",
        description: "Payment credential deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete payment credential",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CredentialForm) => {
    createMutation.mutate(data);
  };

  const toggleShowValue = (id: number) => {
    setShowValues(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getKeyTypeOptions = (provider: string) => {
    if (provider === "stripe") {
      return [
        { value: "public_key", label: "Publishable Key (pk_...)" },
        { value: "secret_key", label: "Secret Key (sk_...)" },
      ];
    } else if (provider === "paypal") {
      return [
        { value: "client_id", label: "Client ID" },
        { value: "client_secret", label: "Client Secret" },
      ];
    }
    return [];
  };

  const formatKeyValue = (value: string, show: boolean) => {
    if (show) return value;
    if (value.length <= 8) return "••••••••";
    return value.slice(0, 4) + "••••••••" + value.slice(-4);
  };

  const getCredentialTitle = (provider: string, keyType: string) => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    const keyTypeName = keyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${providerName} ${keyTypeName}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-luxury-dark">Payment Settings</h1>
        <p className="text-gray-600 mt-2">Manage your Stripe and PayPal payment credentials</p>
      </div>

      {/* Add New Credential Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Payment Credential
          </CardTitle>
          <CardDescription>
            Add your Stripe or PayPal API credentials to enable payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select key type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getKeyTypeOptions(form.watch("provider")).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="keyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key Value</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Enter your API key" />
                    </FormControl>
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
                      <div className="text-sm text-muted-foreground">
                        Enable this credential for payment processing
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

              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? "Saving..." : "Save Credential"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Saved Credentials
          </CardTitle>
          <CardDescription>
            Manage your existing payment credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment credentials configured</p>
              <p className="text-sm text-gray-400">Add your first credential above to enable payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-luxury-dark">
                      {getCredentialTitle(credential.provider, credential.keyType)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {formatKeyValue(credential.keyValue, showValues[credential.id])}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowValue(credential.id)}
                        className="h-6 w-6 p-0"
                      >
                        {showValues[credential.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Added {new Date(credential.createdAt).toLocaleDateString()}
                      {credential.isActive ? (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(credential.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Current status of your payment gateway integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["stripe", "paypal"].map(provider => {
              const providerCredentials = credentials.filter(c => c.provider === provider && c.isActive);
              const isConfigured = providerCredentials.length > 0;
              
              return (
                <div key={provider} className={`p-4 border rounded-lg ${isConfigured ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium capitalize">{provider}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      isConfigured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isConfigured ? 'Configured' : 'Not Configured'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {isConfigured 
                      ? `${providerCredentials.length} active credential(s)`
                      : 'No active credentials'
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}