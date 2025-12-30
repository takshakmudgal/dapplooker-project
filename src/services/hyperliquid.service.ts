import axios from 'axios';

const HL_API_URL = 'https://api.hyperliquid.xyz/info';

export class HyperLiquidService {
    static async getUserFills(user: string, startTime?: number, endTime?: number) {
        try {
            if (startTime) {
                const response = await axios.post(HL_API_URL, {
                    type: 'userFillsByTime',
                    user: user,
                    startTime: startTime,
                    endTime: endTime,
                    aggregateByTime: false
                });
                return response.data || [];
            } else {
                const response = await axios.post(HL_API_URL, {
                    type: 'userFills',
                    user: user,
                });
                return response.data || [];
            }
        } catch (error) {
            console.error('Error fetching user fills:', error);
            return [];
        }
    }

    static async getUserFunding(user: string, startTime: number, endTime?: number) {
        try {
            const response = await axios.post(HL_API_URL, {
                type: 'userFunding',
                user: user,
                startTime: startTime,
                endTime: endTime
            });
            return response.data || [];
        } catch (error) {
            console.error('Error fetching user funding:', error);
            return [];
        }
    }

    static async getClearinghouseState(user: string) {
        try {
            const response = await axios.post(HL_API_URL, {
                type: 'clearinghouseState',
                user: user
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching clearinghouse state:', error);
            return null;
        }
    }

    static async getCandles(coin: string, startTime: number, endTime: number) {
        try {
            const response = await axios.post(HL_API_URL, {
                type: "candleSnapshot",
                req: {
                    coin: coin,
                    interval: "1d",
                    startTime: startTime,
                    endTime: endTime
                }
            });
            return response.data || [];
        } catch (error) {
            console.error(`Error fetching candles for ${coin}:`, error);
            return [];
        }
    }
}
