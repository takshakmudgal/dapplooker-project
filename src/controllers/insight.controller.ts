import { Request, Response } from 'express';
import { CoinGeckoService } from '../services/coingecko.service';
import { GeminiService } from '../services/gemini.service';
import { prisma } from '../config/database';

export const getInsight = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body || {};
    const { vs_currency = 'usd', history_days = 30 } = body;

    try {
        const tokenData = await CoinGeckoService.getTokenData(id);
        const marketChart = await CoinGeckoService.getMarketChart(id, history_days, vs_currency);
        const prompt = GeminiService.buildPrompt(tokenData, marketChart);
        const insight = await GeminiService.generateInsight(prompt);

        const response = {
            source: "coingecko",
            token: {
                id: tokenData.id,
                symbol: tokenData.symbol,
                name: tokenData.name,
                market_data: {
                    current_price_usd: tokenData.market_data.current_price.usd,
                    market_cap_usd: tokenData.market_data.market_cap.usd,
                    total_volume_usd: tokenData.market_data.total_volume.usd,
                    price_change_percentage_24h: tokenData.market_data.price_change_percentage_24h,
                }
            },
            insight: {
                reasoning: insight.reasoning,
                sentiment: insight.sentiment
            },
            model: { provider: "google", model: "gemini-2.0-flash" }
        };

        await prisma.tokenInsight.create({
            data: {
                tokenId: id,
                insight: response as any
            }
        });

        res.json(response);
    } catch (error) {
        console.error(`Error processing insight for ${id}:`, error);
        res.status(500).json({ error: 'Failed to generate token insight' });
    }
};
