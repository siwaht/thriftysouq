import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import type { Product } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MarketingContent {
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

export interface ProductAnalysis {
  luxuryScore: number;
  discountAppeal: number;
  targetAudience: string;
  sellingPoints: string[];
  competitiveAdvantages: string[];
  emotionalHooks: string[];
}

export class AIMarketingGenerator {
  
  async generateWithGemini(prompt: string, systemPrompt: string): Promise<any> {
    try {
      console.log("Generating with Gemini...");
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const rawJson = response.text;
      console.log("Gemini response received:", rawJson ? "Success" : "Empty");
      return rawJson ? JSON.parse(rawJson) : {};
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw new Error("Failed to generate content with Gemini");
    }
  }

  async generateDualAIContent(products: Product[]): Promise<{
    openaiContent: MarketingContent;
    geminiContent: MarketingContent;
    bestContent: MarketingContent;
    comparison: string;
  }> {
    try {
      // Generate content with both AIs
      const [openaiContent, geminiContent] = await Promise.all([
        this.generateHeroBannerContent(products),
        this.generateHeroBannerContentWithGemini(products)
      ]);

      // Compare and select the best elements
      const bestContent = await this.selectBestContent(openaiContent, geminiContent, products);
      
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
    const totalValue = products.reduce((sum, p) => sum + p.originalPrice, 0);
    const totalSavings = products.reduce((sum, p) => sum + (p.originalPrice - p.discountedPrice), 0);
    const avgDiscount = Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length);
    const topBrands = [...new Set(products.map(p => p.brand))].slice(0, 3);
    const categories = [...new Set(products.map(p => p.category))];

    const prompt = `Create compelling hero banner content for luxury e-commerce:

PRODUCT DATA:
- ${products.length} luxury products
- Top brands: ${topBrands.join(", ")}
- Categories: ${categories.join(", ")}
- Average discount: ${avgDiscount}%
- Total savings: $${totalSavings.toLocaleString()}

Create high-converting copy that drives immediate luxury purchases.

Required JSON format:
{
  "badgeText": "urgent badge text (3-5 words)",
  "mainTitle": "powerful headline (1-2 words)",
  "highlightTitle": "luxury emphasis (1-2 words)", 
  "subtitle": "compelling subtitle (2-4 words)",
  "description": "persuasive 2-3 sentence description",
  "buttonText": "action button (2-3 words)",
  "footerText": "incentive text (under 8 words)",
  "urgencyTactics": ["tactic1", "tactic2", "tactic3"],
  "emotionalTriggers": ["trigger1", "trigger2", "trigger3"],
  "salesTechniques": ["technique1", "technique2", "technique3"]
}`;

    const systemPrompt = "You are an expert luxury marketing copywriter creating high-conversion sales content that drives immediate action and maximizes revenue.";

    return await this.generateWithGemini(prompt, systemPrompt);
  }

  async selectBestContent(openaiContent: MarketingContent, geminiContent: MarketingContent, products: Product[]): Promise<MarketingContent> {
    const analysisPrompt = `Compare these two AI-generated marketing contents and create the optimal combination:

OPENAI VERSION:
${JSON.stringify(openaiContent, null, 2)}

GEMINI VERSION:
${JSON.stringify(geminiContent, null, 2)}

PRODUCT CONTEXT: ${products.length} luxury items, average ${Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length)}% discount

Select the best elements from each and create an optimized version that maximizes conversion potential.

Return the optimal combination in the same JSON format.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a conversion optimization expert. Analyze multiple AI-generated contents and create the optimal combination for maximum sales performance."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Content selection error:", error);
      // Return OpenAI content as fallback
      return openaiContent;
    }
  }
  
  async analyzeProducts(products: Product[]): Promise<ProductAnalysis> {
    console.log("Starting product analysis for", products.length, "products");
    
    const productData = products.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      originalPrice: p.originalPrice,
      discountedPrice: p.discountedPrice,
      discount: p.discount,
      stock: p.stock
    }));

    const prompt = `Analyze this luxury product catalog and provide insights for maximum sales conversion:

Products: ${JSON.stringify(productData, null, 2)}

Please analyze and respond with JSON in this exact format:
{
  "luxuryScore": (0-100 rating of overall luxury appeal),
  "discountAppeal": (0-100 rating of discount attractiveness),
  "targetAudience": "description of ideal customer",
  "sellingPoints": ["point1", "point2", "point3"],
  "competitiveAdvantages": ["advantage1", "advantage2", "advantage3"],
  "emotionalHooks": ["hook1", "hook2", "hook3"]
}

Focus on luxury psychology, urgency creation, and conversion optimization.`;

    try {
      console.log("Calling OpenAI for product analysis...");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert luxury marketing analyst specializing in high-conversion sales copy. Analyze product catalogs to identify the most compelling selling angles."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000
      });

      console.log("OpenAI analysis completed successfully");
      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error analyzing products:", error);
      throw new Error("Failed to analyze products with AI");
    }
  }

  async generateHeroBannerContent(products: Product[], analysis?: ProductAnalysis): Promise<MarketingContent> {
    const productAnalysis = analysis || await this.analyzeProducts(products);
    
    const totalValue = products.reduce((sum, p) => sum + p.originalPrice, 0);
    const totalSavings = products.reduce((sum, p) => sum + (p.originalPrice - p.discountedPrice), 0);
    const avgDiscount = Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length);
    const topBrands = [...new Set(products.map(p => p.brand))].slice(0, 3);
    const categories = [...new Set(products.map(p => p.category))];

    const prompt = `Create compelling hero banner content for a luxury e-commerce site. Use these insights:

PRODUCT ANALYSIS:
- ${products.length} luxury products
- Top brands: ${topBrands.join(", ")}
- Categories: ${categories.join(", ")}
- Average discount: ${avgDiscount}%
- Total savings available: $${totalSavings.toLocaleString()}
- Luxury score: ${productAnalysis.luxuryScore}/100
- Target audience: ${productAnalysis.targetAudience}
- Key selling points: ${productAnalysis.sellingPoints.join(", ")}
- Emotional hooks: ${productAnalysis.emotionalHooks.join(", ")}

Create high-converting marketing copy that:
1. Creates urgent desire for luxury at discounted prices
2. Emphasizes authenticity and exclusivity
3. Uses psychological triggers for immediate action
4. Appeals to the target audience's aspirations
5. Highlights massive savings and limited availability

Respond with JSON in this exact format:
{
  "badgeText": "short urgent badge text (3-5 words)",
  "mainTitle": "powerful main headline word (1-2 words)",
  "highlightTitle": "emphasized luxury word (1-2 words)", 
  "subtitle": "compelling subtitle (2-4 words)",
  "description": "persuasive 2-3 sentence description emphasizing value, authenticity, and urgency",
  "buttonText": "action-driving button text (2-3 words)",
  "footerText": "additional incentive or guarantee (under 8 words)",
  "urgencyTactics": ["tactic1", "tactic2", "tactic3"],
  "emotionalTriggers": ["trigger1", "trigger2", "trigger3"],
  "salesTechniques": ["technique1", "technique2", "technique3"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are a world-class copywriter specializing in luxury goods and high-conversion sales copy. Create compelling marketing content that drives immediate action and maximizes sales."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error generating marketing content:", error);
      throw new Error("Failed to generate marketing content with AI");
    }
  }

  async generateProductDescriptions(product: Product): Promise<{
    shortDescription: string;
    longDescription: string;
    sellingPoints: string[];
    urgencyText: string;
  }> {
    const prompt = `Create compelling product descriptions for this luxury item:

PRODUCT: ${product.name}
BRAND: ${product.brand}
CATEGORY: ${product.category}
ORIGINAL PRICE: $${product.originalPrice}
SALE PRICE: $${product.discountedPrice}
DISCOUNT: ${product.discount}%
STOCK: ${product.stock} remaining

Create high-converting product copy that:
1. Emphasizes luxury, quality, and exclusivity
2. Highlights the incredible savings opportunity
3. Creates urgency with limited availability
4. Appeals to aspirational desires
5. Uses sensory and emotional language

Respond with JSON:
{
  "shortDescription": "compelling 1-2 sentence description for product cards",
  "longDescription": "detailed 3-4 sentence description for product details",
  "sellingPoints": ["point1", "point2", "point3", "point4"],
  "urgencyText": "urgency message based on stock level"
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert luxury product copywriter who creates descriptions that drive sales and conversions."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error generating product descriptions:", error);
      throw new Error("Failed to generate product descriptions with AI");
    }
  }

  async optimizeForConversion(currentContent: any, performanceData?: any): Promise<MarketingContent> {
    const prompt = `Optimize this marketing content for higher conversion rates:

CURRENT CONTENT: ${JSON.stringify(currentContent, null, 2)}

${performanceData ? `PERFORMANCE DATA: ${JSON.stringify(performanceData, null, 2)}` : ''}

Apply advanced conversion optimization techniques:
1. Psychological triggers (scarcity, social proof, authority)
2. Emotional persuasion (FOMO, aspiration, status)
3. Urgency and limited-time offers
4. Value proposition enhancement
5. Call-to-action optimization

Create improved content that will increase click-through and conversion rates.

Respond with optimized JSON in the same format as the input.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a conversion rate optimization expert specializing in luxury e-commerce. Optimize content for maximum sales performance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 1200
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Error optimizing content:", error);
      throw new Error("Failed to optimize content with AI");
    }
  }
}

export const aiMarketing = new AIMarketingGenerator();