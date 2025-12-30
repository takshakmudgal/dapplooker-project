import axios from 'axios';
import { CONFIG } from '../config/env.config';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export class CoinGeckoService {
    static async getTokenData(tokenId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/coins/${tokenId}`, {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                    sparkline: false,
                    x_cg_demo_api_key: CONFIG.COINGECKO_API_KEY,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data for token ${tokenId}:`, error);
            throw new Error(`Failed to fetch token data from CoinGecko`);
        }
    }

    static async getMarketChart(tokenId: string, days: number = 30, vsCurrency: string = 'usd') {
        try {
            const response = await axios.get(`${BASE_URL}/coins/${tokenId}/market_chart`, {
                params: {
                    vs_currency: vsCurrency,
                    days: days,
                    x_cg_demo_api_key: CONFIG.COINGECKO_API_KEY,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching market chart for token ${tokenId}:`, error);
            return null;
        }
    }
}
