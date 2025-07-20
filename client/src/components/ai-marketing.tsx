import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Sparkles, Zap, Target, TrendingUp, Copy, CheckCircle, AlertCircle } from "lucide-react";

interface ProductAnalysis {
  luxuryScore: number;
  discountAppeal: number;
  targetAudience: string;
  sellingPoints: string[];
  competitiveAdvantages: string[];
  emotionalHooks: string[];
}

interface MarketingContent {
  badgeText: string;
  mainTitle: string;
  highlightTitle: string;
  subtitle: string;
  description: string;
  buttonText: string;
  footerText: string;
  urgencyTactics: string[];
  emotionalTriggers: string[];
  salesTechniques: string[];
}

interface DualAIResult {
  openaiContent: MarketingContent;
  geminiContent: MarketingContent;
  bestContent: MarketingContent;
  comparison: string;
}

export function AIMarketing() {
  const [selectedProvider, setSelectedProvider] = useState<"openai" | "gemini">("openai");
  const [generatedContent, setGeneratedContent] = useState<MarketingContent | null>(null);
  const [dualAIResult, setDualAIResult] = useState<DualAIResult | null>(null);
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"analyze" | "generate" | "dual" | "apply">("analyze");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Analyze products
  const analyzeProductsMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/ai-marketing/analyze", { method: "POST" }),
    onSuccess: (data: ProductAnalysis) => {
      setProductAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your product catalog successfully.",
      });
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze products with AI.",
        variant: "destructive",
      });
    },
  });

  // Generate banner content
  const generateBannerMutation = useMutation({
    mutationFn: ({ aiProvider }: { aiProvider: string }) =>
      apiRequest("/api/admin/ai-marketing/generate-banner", { 
        method: "POST", 
        body: JSON.stringify({ aiProvider }) 
      }),
    onSuccess: (data: { content: MarketingContent; provider: string }) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content Generated",
        description: `AI-powered marketing content created with ${data.provider}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Could not generate marketing content.",
        variant: "destructive",
      });
    },
  });

  // Generate dual AI content
  const generateDualAIMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/ai-marketing/generate-dual", { method: "POST" }),
    onSuccess: (data: DualAIResult) => {
      setDualAIResult(data);
      toast({
        title: "Dual AI Generation Complete",
        description: "Content generated and optimized using both OpenAI and Gemini.",
      });
    },
    onError: (error) => {
      toast({
        title: "Dual AI Generation Failed",
        description: "Could not generate dual AI content.",
        variant: "destructive",
      });
    },
  });

  // Apply content to banner
  const applyBannerMutation = useMutation({
    mutationFn: (content: MarketingContent) =>
      apiRequest("/api/admin/hero-banner", { 
        method: "PUT", 
        body: JSON.stringify(content) 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-banner"] });
      toast({
        title: "Content Applied",
        description: "AI-generated content has been applied to your hero banner.",
      });
    },
    onError: (error) => {
      toast({
        title: "Application Failed",
        description: "Could not apply content to banner.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-2">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${score}, 100`}
            className="text-emerald-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">{score}</span>
        </div>
      </div>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Marketing Generator</h2>
          <p className="text-slate-600">Analyze products and create compelling sales content</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
        {[
          { id: "analyze", label: "Analyze Products", icon: Target },
          { id: "generate", label: "Generate Content", icon: Sparkles },
          { id: "dual", label: "Dual AI", icon: Zap },
          { id: "apply", label: "Apply & Test", icon: CheckCircle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === id
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "analyze" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              Product Analysis
            </CardTitle>
            <CardDescription>
              AI analyzes your product catalog to identify key selling points and target audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => analyzeProductsMutation.mutate()}
                disabled={analyzeProductsMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {analyzeProductsMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Products...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Product Catalog
                  </>
                )}
              </Button>

              {productAnalysis && (
                <div className="space-y-4 mt-6">
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg">
                    <ScoreCircle score={productAnalysis.luxuryScore} label="Luxury Appeal" />
                    <ScoreCircle score={productAnalysis.discountAppeal} label="Discount Appeal" />
                  </div>

                  {/* Target Audience */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Target Audience</h4>
                    <p className="text-blue-800">{productAnalysis.targetAudience}</p>
                  </div>

                  {/* Selling Points */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Key Selling Points</h4>
                      <ul className="space-y-1">
                        {productAnalysis.sellingPoints.map((point, idx) => (
                          <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Competitive Advantages</h4>
                      <ul className="space-y-1">
                        {productAnalysis.competitiveAdvantages.map((advantage, idx) => (
                          <li key={idx} className="text-purple-800 text-sm flex items-start gap-2">
                            <TrendingUp className="h-3 w-3 mt-0.5 text-purple-600 flex-shrink-0" />
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Emotional Hooks</h4>
                      <ul className="space-y-1">
                        {productAnalysis.emotionalHooks.map((hook, idx) => (
                          <li key={idx} className="text-orange-800 text-sm flex items-start gap-2">
                            <Sparkles className="h-3 w-3 mt-0.5 text-orange-600 flex-shrink-0" />
                            {hook}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "generate" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Generate Marketing Content
            </CardTitle>
            <CardDescription>
              Create compelling hero banner content using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => generateBannerMutation.mutate({ aiProvider: selectedProvider })}
                  disabled={generateBannerMutation.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {generateBannerMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>

              {generatedContent && (
                <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Generated Content</h4>
                    <Badge variant="outline" className="text-emerald-600">
                      {selectedProvider === "openai" ? "OpenAI" : "Gemini"}
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Badge Text</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{generatedContent.badgeText}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.badgeText)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Main Title</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-lg">{generatedContent.mainTitle}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.mainTitle)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Highlight Title</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-emerald-600">{generatedContent.highlightTitle}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.highlightTitle)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Subtitle</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{generatedContent.subtitle}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.subtitle)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Button Text</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{generatedContent.buttonText}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.buttonText)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg">
                          <label className="text-sm font-medium text-slate-600">Footer Text</label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">{generatedContent.footerText}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedContent.footerText)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <label className="text-sm font-medium text-slate-600">Description</label>
                      <div className="flex gap-2 mt-1">
                        <p className="flex-1 text-sm">{generatedContent.description}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedContent.description)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <Button
                      onClick={() => applyBannerMutation.mutate(generatedContent)}
                      disabled={applyBannerMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {applyBannerMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Apply to Hero Banner
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "dual" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              Dual AI Comparison
            </CardTitle>
            <CardDescription>
              Generate content with both OpenAI and Gemini, then get the optimized combination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => generateDualAIMutation.mutate()}
                disabled={generateDualAIMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                {generateDualAIMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating with Both AIs...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Dual AI Content
                  </>
                )}
              </Button>

              {dualAIResult && (
                <div className="space-y-6 mt-6">
                  {/* Best Combined Content */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-emerald-600">Optimized Result</Badge>
                      <span className="text-sm text-slate-600">Best combination of both AIs</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Main Title</p>
                        <p className="font-bold text-lg">{dualAIResult.bestContent.mainTitle}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Highlight</p>
                        <p className="font-bold text-emerald-600">{dualAIResult.bestContent.highlightTitle}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-slate-600">Description</p>
                        <p className="text-sm mt-1">{dualAIResult.bestContent.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => applyBannerMutation.mutate(dualAIResult.bestContent)}
                      disabled={applyBannerMutation.isPending}
                      className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Apply Optimized Content
                    </Button>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-blue-600">OpenAI</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {dualAIResult.openaiContent.mainTitle}</div>
                        <div><strong>Badge:</strong> {dualAIResult.openaiContent.badgeText}</div>
                        <div><strong>Button:</strong> {dualAIResult.openaiContent.buttonText}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-green-600">Gemini</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {dualAIResult.geminiContent.mainTitle}</div>
                        <div><strong>Badge:</strong> {dualAIResult.geminiContent.badgeText}</div>
                        <div><strong>Button:</strong> {dualAIResult.geminiContent.buttonText}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "apply" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Apply & Test Content
            </CardTitle>
            <CardDescription>
              Apply generated content to your hero banner and test its effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent || dualAIResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 mb-2" />
                    <p className="text-sm text-slate-600 mb-4">
                      You have generated content ready to apply. Click below to update your hero banner.
                    </p>
                    <div className="flex gap-2">
                      {generatedContent && (
                        <Button
                          onClick={() => applyBannerMutation.mutate(generatedContent)}
                          disabled={applyBannerMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Apply Single AI Content
                        </Button>
                      )}
                      {dualAIResult && (
                        <Button
                          onClick={() => applyBannerMutation.mutate(dualAIResult.bestContent)}
                          disabled={applyBannerMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Apply Optimized Content
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p>No generated content available. Generate content first in the other tabs.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}