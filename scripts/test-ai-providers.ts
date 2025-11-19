
import { providerRegistry } from "../server/ai/provider-registry";
import { OpenAIProvider } from "../server/ai/openai-provider";
import { GeminiProvider } from "../server/ai/gemini-provider";
import { ElevenLabsProvider } from "../server/ai/elevenlabs-provider";

async function testAIProviders() {
    console.log("Starting AI Provider Verification...");

    // Register providers
    console.log("Registering providers...");
    providerRegistry.registerConversationalProvider(new OpenAIProvider());
    providerRegistry.registerConversationalProvider(new GeminiProvider());
    providerRegistry.registerTTSProvider(new ElevenLabsProvider());

    // Test OpenAI
    try {
        console.log("\nTesting OpenAI Provider...");
        const openai = providerRegistry.getConversationalProvider("openai");
        const analysis = await openai.analyzeProducts([{
            id: 1,
            name: "Test Product",
            description: "A test product",
            price: "100",
            category: "test",
            stock: 10,
            images: []
        } as any]);
        console.log("OpenAI Analysis Result:", analysis ? "Success" : "Failed");
    } catch (error) {
        console.error("OpenAI Test Failed:", error instanceof Error ? error.message : String(error));
    }

    // Test Gemini
    try {
        console.log("\nTesting Gemini Provider...");
        const gemini = providerRegistry.getConversationalProvider("gemini");
        const banner = await gemini.generateHeroBanner([{
            id: 1,
            name: "Test Product",
            description: "A test product",
            price: "100",
            category: "test",
            stock: 10,
            images: []
        } as any]);
        console.log("Gemini Banner Result:", banner ? "Success" : "Failed");
    } catch (error) {
        console.error("Gemini Test Failed:", error instanceof Error ? error.message : String(error));
    }

    // Test ElevenLabs
    try {
        console.log("\nTesting ElevenLabs Provider...");
        const elevenlabs = providerRegistry.getTTSProvider("elevenlabs");
        const voices = await elevenlabs.getVoices();
        console.log(`ElevenLabs Voices Found: ${voices.length}`);

        if (voices.length > 0) {
            console.log("Generating speech with first voice...");
            const audio = await elevenlabs.generateSpeech("Hello, this is a test.", voices[0].id);
            console.log("Audio generated, size:", audio.length);
        }
    } catch (error) {
        console.error("ElevenLabs Test Failed:", error instanceof Error ? error.message : String(error));
    }

    console.log("\nVerification Complete.");
}

testAIProviders().catch(console.error);
