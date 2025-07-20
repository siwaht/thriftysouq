import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, RotateCcw, Brain, Sparkles, Zap } from "lucide-react";
import type { HeroBanner, InsertHeroBanner } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function HeroBannerAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: banner, isLoading } = useQuery<HeroBanner>({
    queryKey: ["/api/hero-banner"],
  });

  // Form state with default values
  const [formData, setFormData] = useState<InsertHeroBanner>({
    badgeIcon: "Sparkles",
    badgeText: "Luxury at unprecedented prices",
    mainTitle: "Premium",
    highlightTitle: "Luxury",
    subtitle: "Made Accessible",
    description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
    buttonText: "Explore Collection",
    footerText: "Free shipping on orders over $200",
    isActive: true,
  });

  // Update form data when banner data loads
  React.useEffect(() => {
    if (banner) {
      setFormData({
        badgeIcon: banner.badgeIcon || "Sparkles",
        badgeText: banner.badgeText || "Luxury at unprecedented prices",
        mainTitle: banner.mainTitle || "Premium",
        highlightTitle: banner.highlightTitle || "Luxury", 
        subtitle: banner.subtitle || "Made Accessible",
        description: banner.description || "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
        buttonText: banner.buttonText || "Explore Collection",
        footerText: banner.footerText || "Free shipping on orders over $200",
        isActive: banner.isActive ?? true,
      });
    }
  }, [banner]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertHeroBanner) => {
      return await apiRequest("/api/admin/hero-banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hero-banner"] });
      toast({
        title: "Success",
        description: "Hero banner updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update hero banner",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertHeroBanner, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    setFormData({
      badgeIcon: "Sparkles",
      badgeText: "Luxury at unprecedented prices",
      mainTitle: "Premium",
      highlightTitle: "Luxury",
      subtitle: "Made Accessible",
      description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
      buttonText: "Explore Collection",
      footerText: "Free shipping on orders over $200",
      isActive: true,
    });
  };

  // AI auto-fill mutations
  const aiOpenAIMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/ai-marketing/generate-banner", { 
      method: "POST", 
      body: JSON.stringify({ aiProvider: "openai" }) 
    }),
    onSuccess: (data: { content: any }) => {
      setFormData(prev => ({
        ...prev,
        badgeText: data.content.badgeText || prev.badgeText,
        mainTitle: data.content.mainTitle || prev.mainTitle,
        highlightTitle: data.content.highlightTitle || prev.highlightTitle,
        subtitle: data.content.subtitle || prev.subtitle,
        description: data.content.description || prev.description,
        buttonText: data.content.buttonText || prev.buttonText,
        footerText: data.content.footerText || prev.footerText,
      }));
      toast({
        title: "OpenAI Content Generated",
        description: "Form auto-filled with AI-generated sales pitch based on your products.",
      });
    },
    onError: () => {
      toast({
        title: "AI Generation Failed",
        description: "Could not generate content with OpenAI.",
        variant: "destructive",
      });
    },
  });

  const aiGeminiMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/ai-marketing/generate-banner", { 
      method: "POST", 
      body: JSON.stringify({ aiProvider: "gemini" }) 
    }),
    onSuccess: (data: { content: any }) => {
      setFormData(prev => ({
        ...prev,
        badgeText: data.content.badgeText || prev.badgeText,
        mainTitle: data.content.mainTitle || prev.mainTitle,
        highlightTitle: data.content.highlightTitle || prev.highlightTitle,
        subtitle: data.content.subtitle || prev.subtitle,
        description: data.content.description || prev.description,
        buttonText: data.content.buttonText || prev.buttonText,
        footerText: data.content.footerText || prev.footerText,
      }));
      toast({
        title: "Gemini Content Generated",
        description: "Form auto-filled with AI-generated sales pitch based on your products.",
      });
    },
    onError: () => {
      toast({
        title: "AI Generation Failed",
        description: "Could not generate content with Gemini.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Banner Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Hero Banner Management</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Edit Mode" : "Preview"}
              </Button>
              <Button
                onClick={resetToDefaults}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Defaults
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPreviewMode ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white rounded-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-purple-500/10"></div>
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
                  <span className="w-4 h-4 text-amber-400">✨</span>
                  {formData.badgeText}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {formData.mainTitle}{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    {formData.highlightTitle}
                  </span>
                  <br />
                  <span className="text-3xl font-light">{formData.subtitle}</span>
                </h1>
                
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  {formData.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                    {formData.buttonText} →
                  </button>
                  
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    {formData.footerText}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="badgeText">Badge Text</Label>
                  <Input
                    id="badgeText"
                    value={formData.badgeText || ""}
                    onChange={(e) => handleInputChange("badgeText", e.target.value)}
                    placeholder="Luxury at unprecedented prices"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText || ""}
                    onChange={(e) => handleInputChange("buttonText", e.target.value)}
                    placeholder="Explore Collection"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainTitle">Main Title</Label>
                  <Input
                    id="mainTitle"
                    value={formData.mainTitle || ""}
                    onChange={(e) => handleInputChange("mainTitle", e.target.value)}
                    placeholder="Premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highlightTitle">Highlight Title</Label>
                  <Input
                    id="highlightTitle"
                    value={formData.highlightTitle || ""}
                    onChange={(e) => handleInputChange("highlightTitle", e.target.value)}
                    placeholder="Luxury"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ""}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    placeholder="Made Accessible"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input
                    id="footerText"
                    value={formData.footerText || ""}
                    onChange={(e) => handleInputChange("footerText", e.target.value)}
                    placeholder="Free shipping on orders over $200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Discover authenticated luxury brands at up to 70% off..."
                  rows={3}
                />
              </div>

              {/* AI Auto-fill Buttons */}
              <div className="border-t pt-6">
                <Label className="text-sm font-medium mb-3 block">AI-Powered Auto-Fill</Label>
                <p className="text-sm text-gray-600 mb-4">Generate compelling sales content based on your current product catalog</p>
                <div className="flex gap-3 mb-4">
                  <Button
                    type="button"
                    onClick={() => aiOpenAIMutation.mutate()}
                    disabled={aiOpenAIMutation.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {aiOpenAIMutation.isPending ? "Generating..." : "Auto-fill with OpenAI"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => aiGeminiMutation.mutate()}
                    disabled={aiGeminiMutation.isPending}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {aiGeminiMutation.isPending ? "Generating..." : "Auto-fill with Gemini"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={resetToDefaults}
                  variant="outline"
                  className="text-gray-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}