import express from 'express';
import cors from 'cors';
import { insightRoutes } from './routes/insight.routes';
import { pnlRoutes } from './routes/pnl.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/token', insightRoutes);
app.use('/api/hyperliquid', pnlRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;
