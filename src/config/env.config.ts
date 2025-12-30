import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
