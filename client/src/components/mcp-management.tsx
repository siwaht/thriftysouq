import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Copy, Play, Server, Code, Database, BarChart3, Webhook, CheckCircle, XCircle, Clock, ClipboardList, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MCPEndpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  category: string;
}

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  responseTime?: number;
  timestamp: string;
}

export function MCPManagement() {
  const [mcpInfo, setMcpInfo] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("info");
  const [testMethod, setTestMethod] = useState<string>("GET");
  const [testPath, setTestPath] = useState<string>("/mcp/info");
  const [testBody, setTestBody] = useState<string>("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mcpEndpoints: MCPEndpoint[] = [
    { name: "Server Info", method: "GET", path: "/mcp/info", description: "Get MCP server information and capabilities", category: "system" },
    { name: "Health Check", method: "GET", path: "/mcp/health", description: "Check MCP server health status", category: "system" },
    { name: "List Products", method: "GET", path: "/mcp/products", description: "Get all products with optional category filtering", category: "products" },
    { name: "Create Product", method: "POST", path: "/mcp/products", description: "Create a new product via MCP", category: "products" },
    { name: "List Orders", method: "GET", path: "/mcp/orders", description: "Get all orders with optional status filtering", category: "orders" },  
    { name: "Hero Banner", method: "GET", path: "/mcp/marketing/hero-banner", description: "Get current hero banner content", category: "marketing" },
    { name: "Get Analytics", method: "GET", path: "/mcp/analytics", description: "Get business analytics and metrics", category: "analytics" },
  ];

  useEffect(() => {
    fetchMCPInfo();
  }, []);

  const fetchMCPInfo = async () => {
    try {
      const response = await fetch('/mcp/info');
      const info = await response.json();
      setMcpInfo(info);
    } catch (error) {
      console.error('Failed to fetch MCP info:', error);
    }
  };

  const testEndpoint = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method: testMethod,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (testMethod !== 'GET' && testBody.trim()) {
        try {
          JSON.parse(testBody); // Validate JSON
          options.body = testBody;
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }

      const response = await fetch(testPath, options);
      const data = await response.json();
      const responseTime = Date.now() - startTime;

      setTestResult({
        success: response.ok,
        data,
        responseTime,
        timestamp: new Date().toISOString(),
        error: !response.ok ? data.error || 'Unknown error' : undefined
      });

      if (response.ok) {
        toast({
          title: "Test Successful",
          description: `Endpoint responded in ${responseTime}ms`,
        });
      } else {
        toast({
          title: "Test Failed", 
          description: data.error || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        responseTime,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : 'Network error',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const selectEndpoint = (endpoint: MCPEndpoint) => {
    setSelectedEndpoint(endpoint.name);
    setTestMethod(endpoint.method);
    setTestPath(endpoint.path);
    setTestBody("");
    setTestResult(null);
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.success) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-900">MCP Server Management</h2>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="testing">API Testing</TabsTrigger>
          <TabsTrigger value="documentation">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mcpInfo ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{mcpInfo.description}</p>
                    <p className="text-xs text-slate-500">Version: {mcpInfo.version}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mcpInfo?.capabilities ? (
                  <div className="flex flex-wrap gap-1">
                    {mcpInfo.capabilities.map((cap: string) => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No capabilities loaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common MCP server operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" onClick={() => fetchMCPInfo()}>
                  <Server className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(window.location.origin + '/mcp/info')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Base URL
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('/mcp/info', '_blank')}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Info Endpoint
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open('/mcp/health', '_blank')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Health Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>All MCP server endpoints organized by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['system', 'products', 'orders', 'marketing', 'analytics'].map((category) => (
                  <div key={category}>
                    <h4 className="font-semibold text-sm text-slate-700 mb-2 capitalize flex items-center gap-2">
                      {category === 'system' && <Server className="h-4 w-4" />}
                      {category === 'products' && <Database className="h-4 w-4" />}
                      {category === 'orders' && <ClipboardList className="h-4 w-4" />}
                      {category === 'marketing' && <Tag className="h-4 w-4" />}
                      {category === 'analytics' && <BarChart3 className="h-4 w-4" />}
                      {category}
                    </h4>
                    <div className="grid gap-2">
                      {mcpEndpoints.filter(ep => ep.category === category).map((endpoint, index) => (
                        <Card key={`${endpoint.category}-${endpoint.method}-${index}`} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'outline'} className="text-xs">
                                    {endpoint.method}
                                  </Badge>
                                  <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                                    {endpoint.path}
                                  </code>
                                </div>
                                <p className="text-sm text-slate-600">{endpoint.description}</p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => selectEndpoint(endpoint)}>
                                Test
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {category !== 'analytics' && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>API Test Console</CardTitle>
                <CardDescription>Test MCP endpoints with custom parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="method">Method</Label>
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
                  <div>
                    <Label htmlFor="path">Endpoint</Label>
                    <Input
                      id="path"
                      value={testPath}
                      onChange={(e) => setTestPath(e.target.value)}
                      placeholder="/mcp/info"
                    />
                  </div>
                </div>

                {testMethod !== 'GET' && (
                  <div>
                    <Label htmlFor="body">Request Body (JSON)</Label>
                    <Textarea
                      id="body"
                      value={testBody}
                      onChange={(e) => setTestBody(e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={4}
                    />
                  </div>
                )}

                <Button onClick={testEndpoint} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Test Endpoint
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Response from the last API test</CardDescription>
              </CardHeader>
              <CardContent>
                {testResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(testResult)}
                        <span className="text-sm font-medium">
                          {testResult.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {testResult.responseTime}ms
                      </div>
                    </div>

                    {testResult.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{testResult.error}</AlertDescription>
                      </Alert>
                    )}

                    {testResult.data && (
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Response Data</Label>
                        <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto max-h-64 border">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="text-xs text-slate-400">
                      Tested at: {new Date(testResult.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No test results yet. Run a test to see the response.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Integration</CardTitle>
              <CardDescription>Connect your MCP server to AI assistants like Claude Desktop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Claude Desktop Configuration</Label>
                <pre className="bg-slate-50 p-4 rounded border text-sm overflow-auto">
{`{
  "mcpServers": {
    "thriftysouq": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "cwd": "/path/to/thriftysouq"
    }
  }
}`}
                </pre>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(`{
  "mcpServers": {
    "thriftysouq": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "cwd": "/path/to/thriftysouq"
    }
  }
}`)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Configuration
                </Button>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-2 block">HTTP API Integration</Label>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Base URL: <code className="bg-slate-100 px-1 rounded">{window.location.origin}/mcp</code></p>
                  <p className="text-sm text-slate-600">Authentication: Optional X-API-Key header</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(window.location.origin + '/mcp')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Base URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard('curl -H "X-API-Key: your-key" ' + window.location.origin + '/mcp/info')}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy cURL Example
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
              <CardDescription>Sample AI assistant prompts for your MCP server</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded border">
                  <p className="text-sm">"Show me all luxury watches in the ThriftySouq catalog"</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border">
                  <p className="text-sm">"Create a new product for a Cartier bracelet with 25% discount"</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border">
                  <p className="text-sm">"Generate analytics report for this month's sales"</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border">
                  <p className="text-sm">"What are the top-selling product categories?"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}