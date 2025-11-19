import { Product } from "@shared/schema";

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

export interface IConversationalAIProvider {
  id: string;
  name: string;
  analyzeProducts(products: Product[]): Promise<ProductAnalysis>;
  generateHeroBanner(products: Product[], analysis?: ProductAnalysis): Promise<MarketingContent>;
  generateProductDescriptions(product: Product): Promise<{
    shortDescription: string;
    longDescription: string;
    sellingPoints: string[];
    urgencyText: string;
  }>;
  optimizeContent(currentContent: any, performanceData?: any): Promise<MarketingContent>;
}

export interface ITTSProvider {
  id: string;
  name: string;
  generateSpeech(text: string, voiceId?: string): Promise<Buffer>;
  getVoices(): Promise<any[]>;
}

export class ProviderRegistry {
  private conversationalProviders: Map<string, IConversationalAIProvider> = new Map();
  private ttsProviders: Map<string, ITTSProvider> = new Map();
  private defaultConversationalProvider: string = "openai";
  private defaultTTSProvider: string = "elevenlabs";

  registerConversationalProvider(provider: IConversationalAIProvider) {
    this.conversationalProviders.set(provider.id, provider);
    console.log(`Registered conversational provider: ${provider.name}`);
  }

  registerTTSProvider(provider: ITTSProvider) {
    this.ttsProviders.set(provider.id, provider);
    console.log(`Registered TTS provider: ${provider.name}`);
  }

  getConversationalProvider(id?: string): IConversationalAIProvider {
    const providerId = id || this.defaultConversationalProvider;
    const provider = this.conversationalProviders.get(providerId);
    if (!provider) {
      // Fallback to first available if default not found
      if (this.conversationalProviders.size > 0) {
        return this.conversationalProviders.values().next().value;
      }
      throw new Error(`Conversational provider '${providerId}' not found and no fallbacks available`);
    }
    return provider;
  }

  getTTSProvider(id?: string): ITTSProvider {
    const providerId = id || this.defaultTTSProvider;
    const provider = this.ttsProviders.get(providerId);
    if (!provider) {
      if (this.ttsProviders.size > 0) {
        return this.ttsProviders.values().next().value;
      }
      throw new Error(`TTS provider '${providerId}' not found`);
    }
    return provider;
  }

  getAllConversationalProviders(): { id: string; name: string }[] {
    return Array.from(this.conversationalProviders.values()).map(p => ({
      id: p.id,
      name: p.name
    }));
  }

  getAllTTSProviders(): { id: string; name: string }[] {
    return Array.from(this.ttsProviders.values()).map(p => ({
      id: p.id,
      name: p.name
    }));
  }
}

export const providerRegistry = new ProviderRegistry();
