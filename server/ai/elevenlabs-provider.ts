import { ElevenLabsClient } from "elevenlabs";
import { ITTSProvider } from "./provider-registry";

export class ElevenLabsProvider implements ITTSProvider {
    id = "elevenlabs";
    name = "ElevenLabs";
    private client: ElevenLabsClient;

    constructor() {
        this.client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    }

    async generateSpeech(text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM"): Promise<Buffer> {
        try {
            const audioStream = await this.client.generate({
                voice: voiceId,
                text,
                model_id: "eleven_monolingual_v1"
            });

            const chunks: Buffer[] = [];
            for await (const chunk of audioStream) {
                chunks.push(Buffer.from(chunk));
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error("ElevenLabs generation error:", error);
            throw new Error("Failed to generate speech with ElevenLabs");
        }
    }

    async getVoices(): Promise<any[]> {
        try {
            const response = await this.client.voices.getAll();
            return response.voices;
        } catch (error) {
            console.error("Error fetching voices:", error);
            throw new Error("Failed to fetch voices from ElevenLabs");
        }
    }
}
