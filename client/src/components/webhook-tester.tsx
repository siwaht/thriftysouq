import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Send, ExternalLink, Code, Key } from "lucide-react";

export function WebhookTester() {
  const [testUrl, setTestUrl] = useState("");
  const [testSecret, setTestSecret] = useState("");
  const [testMethod, setTestMethod] = useState("POST");
  const [testPayload, setTestPayload] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const webhookEndpoints = [
    {
      method: "POST",
      path: "/webhook/products",
      description: "Create a new product",
      example: {
        name: "Luxury Watch",
        brand: "Premium Brand",
        category: "watches",
        originalPrice: "$5,000",
        discountedPrice: "$2,000",
        discount: 60,
        image: "https://example.com/watch.jpg",
        stock: 10
      }
    },
    {
      method: "PUT",
      path: "/webhook/products/:id",
      description: "Update an existing product",
      example: {
        name: "Updated Luxury Watch",
        stock: 5
      }
    },
    {
      method: "DELETE",
      path: "/webhook/products/:id",
      description: "Delete a product",
      example: {}
    },
    {
      method: "GET",
      path: "/webhook/products",
      description: "Get all products",
      example: {}
    },
    {
      method: "POST",
      path: "/webhook/products/bulk",
      description: "Bulk operations (create, update, delete)",
      example: {
        operation: "create",
        products: [
          {
            name: "Product 1",
            brand: "Brand A",
            category: "watches",
            originalPrice: "$1,000",
            discountedPrice: "$500",
            discount: 50,
            image: "https://example.com/product1.jpg",
            stock: 5
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/webhook/orders",
      description: "Get all orders",
      example: {}
    },
    {
      method: "GET", 
      path: "/webhook/orders/:id",
      description: "Get specific order",
      example: {}
    },
    {
      method: "PUT",
      path: "/webhook/orders/:id/status", 
      description: "Update order status",
      example: {
        status: "shipped"
      }
    },
    {
      method: "POST",
      path: "/webhook/orders/bulk-status",
      description: "Bulk update order statuses",
      example: {
        orders: [
          {
            id: 1,
            status: "shipped"
          },
          {
            id: 2,
            status: "delivered"
          }
        ]
      }
    }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard.",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const testWebhook = async () => {
    if (!testUrl) {
      toast({
        title: "URL required",
        description: "Please enter a webhook URL to test.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (testSecret) {
        headers['X-Webhook-Secret'] = testSecret;
      }

      const options: RequestInit = {
        method: testMethod,
        headers,
      };

      if (testMethod !== 'GET' && testPayload) {
        options.body = testPayload;
      }

      const response = await fetch(testUrl, options);
      const responseText = await response.text();
      
      setTestResponse(`Status: ${response.status} ${response.statusText}\n\nResponse:\n${responseText}`);
      
      toast({
        title: "Test completed",
        description: `Webhook test returned ${response.status}`,
        duration: 2000,
      });
    } catch (error) {
      setTestResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Test failed",
        description: "Failed to send webhook request",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (endpoint: typeof webhookEndpoints[0]) => {
    console.log('Loading example for endpoint:', endpoint);
    const baseUrl = window.location.origin;
    let url = `${baseUrl}${endpoint.path}`;
    
    if (endpoint.path.includes(':id')) {
      url = url.replace(':id', '1'); // Use ID 1 as example
    }
    
    setTestUrl(url);
    setTestMethod(endpoint.method);
    setTestPayload(JSON.stringify(endpoint.example, null, 2));
    
    toast({
      title: "Example loaded",
      description: `Loaded ${endpoint.method} ${endpoint.path} example`,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-luxury-black mb-2">
            Webhook <span className="text-luxury-purple">API Tester</span>
          </h3>
          <p className="text-gray-600">Test and integrate with external product and order management webhooks</p>
        </div>
        <Button
          onClick={() => window.open('/webhook-examples.md', '_blank')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          API Docs
        </Button>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="endpoints">Available Endpoints</TabsTrigger>
          <TabsTrigger value="tester">Test Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid gap-4">
            {webhookEndpoints.map((endpoint, index) => (
              <Card key={index} className="luxury-card-shadow-purple border border-purple-100/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'secondary' : 
                               endpoint.method === 'POST' ? 'default' : 
                               endpoint.method === 'PUT' ? 'outline' : 'destructive'}
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono text-gray-700">{endpoint.path}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Button clicked for endpoint:', endpoint);
                        loadExample(endpoint);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Code className="w-3 h-3" />
                      Load Example
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </CardHeader>
                {Object.keys(endpoint.example).length > 0 && (
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Example Payload</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copyToClipboard(JSON.stringify(endpoint.example, null, 2));
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <pre className="text-xs text-gray-700 overflow-x-auto">
                        {JSON.stringify(endpoint.example, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tester" className="space-y-4">
          <Card className="luxury-card-shadow-purple border border-purple-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Webhook Tester
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-2">Method</label>
                  <Select value={testMethod} onValueChange={setTestMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <Input
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="http://localhost:5000/webhook/products"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Webhook Secret (Optional)
                </label>
                <Input
                  type="password"
                  value={testSecret}
                  onChange={(e) => setTestSecret(e.target.value)}
                  placeholder="Enter webhook secret for authentication"
                />
              </div>

              {testMethod !== 'GET' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Request Payload (JSON)</label>
                  <Textarea
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    placeholder="Enter JSON payload..."
                    className="font-mono text-sm min-h-32"
                  />
                </div>
              )}

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testWebhook();
                }}
                disabled={isLoading}
                className="w-full luxury-gradient-purple text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300"
              >
                {isLoading ? "Sending..." : "Send Test Request"}
              </Button>

              {testResponse && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Response</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(testResponse);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Textarea
                    value={testResponse}
                    readOnly
                    className="font-mono text-sm min-h-32 bg-gray-50"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}