import OpenAI from "openai";
import { IConversationalAIProvider, MarketingContent, ProductAnalysis } from "./provider-registry";
import { Product } from "@shared/schema";

export class OpenAIProvider implements IConversationalAIProvider {
    id = "openai";
    name = "OpenAI (GPT-4o)";
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async analyzeProducts(products: Product[]): Promise<ProductAnalysis> {
        console.log("Starting OpenAI product analysis for", products.length, "products");

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
            const response = await this.client.chat.completions.create({
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

            return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
            console.error("Error analyzing products with OpenAI:", error);
            throw new Error("Failed to analyze products with OpenAI");
        }
    }

    async generateHeroBanner(products: Product[], analysis?: ProductAnalysis): Promise<MarketingContent> {
        const productAnalysis = analysis || await this.analyzeProducts(products);

        const totalSavings = products.reduce((sum, p) => sum + (parseFloat(p.originalPrice) - parseFloat(p.discountedPrice)), 0);
        const avgDiscount = Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length);
        const topBrands = Array.from(new Set(products.map(p => p.brand))).slice(0, 3);
        const categories = Array.from(new Set(products.map(p => p.category)));

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

CRITICAL DESIGN REQUIREMENTS:
- Badge text: 2-4 words maximum (e.g., "Limited Time", "Flash Sale")
- Main title: 1-2 words maximum (e.g., "LUXURY", "PREMIUM")
- Highlight title: 1-2 words maximum (e.g., "UNLEASHED", "COLLECTION")
- Subtitle: 2-3 words maximum (e.g., "Exceptional Savings", "Made Accessible")
- Description: Under 100 characters total (e.g., "Authentic luxury brands at up to 70% off. Premium quality, unbeatable prices.")
- Button text: 2-3 words maximum (e.g., "Shop Now", "Explore Deals")
- Footer text: Under 6 words (e.g., "Free worldwide shipping", "Limited stock remaining")

Respond with JSON in this exact format:
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

        try {
            const response = await this.client.chat.completions.create({
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
            console.error("Error generating marketing content with OpenAI:", error);
            throw new Error("Failed to generate marketing content with OpenAI");
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
            const response = await this.client.chat.completions.create({
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
            console.error("Error generating product descriptions with OpenAI:", error);
            throw new Error("Failed to generate product descriptions with OpenAI");
        }
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

Create improved content that will increase click-through and conversion rates.

Respond with optimized JSON in the same format as the input.`;

        try {
            const response = await this.client.chat.completions.create({
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
            console.error("Error optimizing content with OpenAI:", error);
            throw new Error("Failed to optimize content with OpenAI");
        }
    }
}
