import { GoogleGenAI } from "@google/genai";
import { IConversationalAIProvider, MarketingContent, ProductAnalysis } from "./provider-registry";
import { Product } from "@shared/schema";

export class GeminiProvider implements IConversationalAIProvider {
    id = "gemini";
    name = "Google Gemini (2.5 Flash)";
    private client: GoogleGenAI;

    constructor() {
        this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    }

    private async generateWithGemini(prompt: string, systemPrompt: string): Promise<any> {
        try {
            console.log("Generating with Gemini...");
            const response = await this.client.models.generateContent({
                model: "gemini-2.5-flash",
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: "application/json",
                },
                contents: prompt,
            });

            const rawJson = response.text;
            return rawJson ? JSON.parse(rawJson) : {};
        } catch (error) {
            console.error("Gemini generation error:", error);
            throw new Error("Failed to generate content with Gemini");
        }
    }

    async analyzeProducts(products: Product[]): Promise<ProductAnalysis> {
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

        const systemPrompt = "You are an expert luxury marketing analyst specializing in high-conversion sales copy.";
        return await this.generateWithGemini(prompt, systemPrompt);
    }

    async generateHeroBanner(products: Product[], analysis?: ProductAnalysis): Promise<MarketingContent> {
        const totalSavings = products.reduce((sum, p) => sum + (parseFloat(p.originalPrice) - parseFloat(p.discountedPrice)), 0);
        const avgDiscount = Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length);
        const topBrands = Array.from(new Set(products.map(p => p.brand))).slice(0, 3);
        const categories = Array.from(new Set(products.map(p => p.category)));

        const prompt = `Create compelling hero banner content for luxury e-commerce:

PRODUCT DATA:
- ${products.length} luxury products
- Top brands: ${topBrands.join(", ")}
- Categories: ${categories.join(", ")}
- Average discount: ${avgDiscount}%
- Total savings: $${totalSavings.toLocaleString()}

CRITICAL DESIGN CONSTRAINTS:
- Badge text: 2-4 words max (e.g., "Flash Sale", "Limited Time")
- Main title: 1-2 words max (e.g., "LUXURY", "PREMIUM") 
- Highlight title: 1-2 words max (e.g., "UNLEASHED", "COLLECTION")
- Subtitle: 2-3 words max (e.g., "Exceptional Savings", "Made Accessible")
- Description: Under 100 characters total (e.g., "Authentic luxury brands at up to 70% off. Premium quality, unbeatable prices.")
- Button text: 2-3 words max (e.g., "Shop Now", "Explore Deals")
- Footer text: Under 6 words (e.g., "Free worldwide shipping")

Required JSON format with short content:
{
  "badgeText": "2-4 words max",
  "mainTitle": "1-2 words max",
  "highlightTitle": "1-2 words max", 
  "subtitle": "2-3 words max",
  "description": "Under 100 characters emphasizing value and urgency",
  "buttonText": "2-3 words max",
  "footerText": "Under 6 words",
  "urgencyTactics": ["tactic1", "tactic2", "tactic3"],
  "emotionalTriggers": ["trigger1", "trigger2", "trigger3"],
  "salesTechniques": ["technique1", "technique2", "technique3"]
}`;

        const systemPrompt = "You are an expert luxury marketing copywriter creating extremely concise, high-conversion sales content that fits hero banner design constraints. All text must be short and punchy.";
        return await this.generateWithGemini(prompt, systemPrompt);
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

        const systemPrompt = "You are an expert luxury product copywriter who creates descriptions that drive sales and conversions.";
        return await this.generateWithGemini(prompt, systemPrompt);
    }

    async optimizeContent(currentContent: any, performanceData?: any): Promise<MarketingContent> {
        const prompt = `Optimize this marketing content for higher conversion rates:

CURRENT CONTENT: ${JSON.stringify(currentContent, null, 2)}

${performanceData ? `PERFORMANCE DATA: ${JSON.stringify(performanceData, null, 2)}` : ''}

Apply advanced conversion optimization techniques:
1. Psychological triggers (scarcity, social proof, authority)
2. Emotional persuasion (FOMO, aspiration, status)
3. Urgency and limited-time offers
4. Value proposition enhancement
5. Call-to-action optimization

Respond with optimized JSON in the same format as the input.`;

        const systemPrompt = "You are a conversion rate optimization expert specializing in luxury e-commerce. Optimize content for maximum sales performance.";
        return await this.generateWithGemini(prompt, systemPrompt);
    }
}
