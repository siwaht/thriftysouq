import { Product } from "@shared/schema";
import { providerRegistry, MarketingContent, ProductAnalysis } from "./ai/provider-registry";

export class AIMarketingGenerator {

  async generateDualAIContent(products: Product[]): Promise<{
    openaiContent: MarketingContent;
    geminiContent: MarketingContent;
    bestContent: MarketingContent;
    comparison: string;
  }> {
    try {
      const openaiProvider = providerRegistry.getConversationalProvider("openai");
      const geminiProvider = providerRegistry.getConversationalProvider("gemini");

      // Generate content with both AIs
      const [openaiContent, geminiContent] = await Promise.all([
        openaiProvider.generateHeroBanner(products),
        geminiProvider.generateHeroBanner(products)
      ]);

      // Compare and select the best elements (using OpenAI for arbitration)
      const bestContent = await openaiProvider.optimizeContent(
        { openai: openaiContent, gemini: geminiContent },
        { context: "Select best elements from both" }
      );

      return {
        openaiContent,
        geminiContent,
        bestContent,
        comparison: "Content generated and optimized using dual AI analysis"
      };
    } catch (error) {
      console.error("Dual AI generation error:", error);
      throw new Error("Failed to generate dual AI content");
    }
  }

  async generateHeroBannerContentWithGemini(products: Product[]): Promise<MarketingContent> {
    const provider = providerRegistry.getConversationalProvider("gemini");
    return await provider.generateHeroBanner(products);
  }

  async selectBestContent(openaiContent: MarketingContent, geminiContent: MarketingContent, products: Product[]): Promise<MarketingContent> {
    const provider = providerRegistry.getConversationalProvider("openai");
    return await provider.optimizeContent(
      { openai: openaiContent, gemini: geminiContent },
      { productCount: products.length }
    );
  }

  async analyzeProducts(products: Product[]): Promise<ProductAnalysis> {
    // Default to OpenAI for analysis as it's generally better at structured reasoning
    const provider = providerRegistry.getConversationalProvider("openai");
    return await provider.analyzeProducts(products);
  }

  async generateHeroBannerContent(products: Product[], analysis?: ProductAnalysis): Promise<MarketingContent> {
    // Default to OpenAI
    const provider = providerRegistry.getConversationalProvider("openai");
    return await provider.generateHeroBanner(products, analysis);
  }

  async generateProductDescriptions(product: Product): Promise<{
    shortDescription: string;
    longDescription: string;
    sellingPoints: string[];
    urgencyText: string;
  }> {
    // Default to OpenAI
    const provider = providerRegistry.getConversationalProvider("openai");
    return await provider.generateProductDescriptions(product);
  }

  async optimizeForConversion(currentContent: any, performanceData?: any): Promise<MarketingContent> {
    // Default to OpenAI
    const provider = providerRegistry.getConversationalProvider("openai");
    return await provider.optimizeContent(currentContent, performanceData);
  }
}

export const aiMarketing = new AIMarketingGenerator();