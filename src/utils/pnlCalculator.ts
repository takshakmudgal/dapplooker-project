import {
    startOfDay,
    endOfDay,
    parseISO,
    format,
    eachDayOfInterval
} from "date-fns";
import { HyperLiquidService } from "../services/hyperliquid.service";

interface DailyPnL {
    date: string;
    realized_pnl_usd: number;
    unrealized_pnl_usd: number;
    fees_usd: number;
    funding_usd: number;
    net_pnl_usd: number;
    equity_usd: number;
}

interface Fill {
    coin: string;
    sz: string;
    side: string;
    time: number;
    closedPnl: string;
    fee: string;
}

interface FundingEvent {
    time: number;
    delta?: { usdc?: string };
}

interface Candle {
    t: number;
    c: string;
}

export class PnLCalculator {
    static async calculateDailyPnL(
        wallet: string,
        start: string,
        end: string
    ) {
        const startDate = parseISO(start);
        const endDate = parseISO(end);

        const startMs = startOfDay(startDate).getTime();
        const endMs = endOfDay(endDate).getTime();

        const fills: Fill[] =
            await HyperLiquidService.getUserFills(wallet, startMs, endMs);
        const funding: FundingEvent[] =
            await HyperLiquidService.getUserFunding(wallet, startMs, endMs);
        const account =
            await HyperLiquidService.getClearinghouseState(wallet);

        fills.sort((a, b) => a.time - b.time);
        funding.sort((a, b) => a.time - b.time);

        const coins = [...new Set(fills.map(f => f.coin))];
        const candles: Record<string, Candle[]> = {};

        for (const coin of coins) {
            candles[coin] =
                await HyperLiquidService.getCandles(coin, startMs, endMs);
        }

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        const positions: Record<string, number> = {};
        const result: DailyPnL[] = [];

        let equity =
            Number(account?.marginSummary?.accountValue ?? 0);

        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const dayStart = startOfDay(day).getTime();
            const dayEnd = endOfDay(day).getTime();
            const dateStr = format(day, "yyyy-MM-dd");

            let realized = 0;
            let fees = 0;
            let fundingPnl = 0;
            let unrealized = 0;

            for (const f of fills.filter(f => f.time >= dayStart && f.time <= dayEnd)) {
                realized += Number(f.closedPnl || 0);
                fees += Number(f.fee || 0);

                const signedSize =
                    Number(f.sz) * (f.side === "B" ? 1 : -1);
                positions[f.coin] = (positions[f.coin] || 0) + signedSize;
            }

            for (const f of funding.filter(f => f.time >= dayStart && f.time <= dayEnd)) {
                fundingPnl += Number(f.delta?.usdc || 0);
            }

            if (i > 0) {
                const prevTs = startOfDay(days[i - 1]).getTime();

                for (const coin of Object.keys(positions)) {
                    const pos = positions[coin];
                    if (pos === 0) continue;

                    const prev = candles[coin]?.find(c => c.t === prevTs);
                    const curr = candles[coin]?.find(c => c.t === dayStart);

                    if (prev && curr) {
                        unrealized += pos * (Number(curr.c) - Number(prev.c));
                    }
                }
            }

            const net = realized + unrealized + fundingPnl + fees;
            equity += net;

            result.push({
                date: dateStr,
                realized_pnl_usd: +realized.toFixed(6),
                unrealized_pnl_usd: +unrealized.toFixed(6),
                fees_usd: +fees.toFixed(6),
                funding_usd: +fundingPnl.toFixed(6),
                net_pnl_usd: +net.toFixed(6),
                equity_usd: +equity.toFixed(6)
            });
        }

        return {
            wallet,
            start,
            end,
            daily: result,
            summary: {
                total_realized_usd: +result.reduce((a, b) => a + b.realized_pnl_usd, 0).toFixed(6),
                total_unrealized_usd: +result.reduce((a, b) => a + b.unrealized_pnl_usd, 0).toFixed(6),
                total_fees_usd: +result.reduce((a, b) => a + b.fees_usd, 0).toFixed(6),
                total_funding_usd: +result.reduce((a, b) => a + b.funding_usd, 0).toFixed(6),
                net_pnl_usd: +result.reduce((a, b) => a + b.net_pnl_usd, 0).toFixed(6),
                current_equity_usd: +equity.toFixed(6)
            },
            diagnostics: {
                data_source: "hyperliquid_api",
                last_api_call: new Date().toISOString(),
                fills_count: fills.length,
                funding_events_count: funding.length,
                notes: "PnL calculated using daily mark-to-market vs previous close"
            }
        };
    }
}
