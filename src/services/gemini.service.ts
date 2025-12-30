import axios from 'axios';
import { CONFIG } from '../config/env.config';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class GeminiService {
    static async generateInsight(prompt: string): Promise<{ reasoning: string; sentiment: string }> {
        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const candidates = response.data.candidates;
            if (candidates && candidates.length > 0) {
                const textResponse = candidates[0].content.parts[0].text;
                try {
                    return JSON.parse(textResponse);
                } catch {
                    return {
                        reasoning: textResponse,
                        sentiment: "Unknown"
                    }
                }
            }

            throw new Error('No candidates returned from Gemini API');
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error('Failed to generate insight from Gemini');
        }
    }

    static buildPrompt(tokenData: any, marketChart: any): string {
        const price = tokenData.market_data.current_price.usd;
        const priceChange24h = tokenData.market_data.price_change_percentage_24h;
        const marketCap = tokenData.market_data.market_cap.usd;
        const name = tokenData.name;
        const symbol = tokenData.symbol;

        return `You are a crypto analyst. Analyze the following token data and provide a JSON response with "reasoning" (a brief market comment) and "sentiment" (Bullish, Bearish, or Neutral).

Token: ${name} (${symbol.toUpperCase()})
Current Price: $${price}
24h Price Change: ${priceChange24h}%
Market Cap: $${marketCap}

Additional Context: The token has shown this performance over the last 24 hours. ${marketChart ? "Consider the market chart data indicates recent trends." : ""}

Output strictly valid JSON:
{
  "reasoning": "...",
  "sentiment": "..."
}`;
    }
}
