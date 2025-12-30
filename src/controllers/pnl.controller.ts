import { Request, Response } from 'express';
import { PnLCalculator } from '../utils/pnlCalculator';

export const getWalletPnL = async (req: Request, res: Response): Promise<void> => {
    const { wallet } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
        res.status(400).json({ error: 'Start and End dates are required (YYYY-MM-DD)' });
        return;
    }

    try {
        const pnlData = await PnLCalculator.calculateDailyPnL(
            wallet,
            start as string,
            end as string
        );

        res.json(pnlData);
    } catch (error) {
        console.error(`Error calculating PnL for ${wallet}:`, error);
        res.status(500).json({ error: 'Failed to calculate PnL' });
    }
};
