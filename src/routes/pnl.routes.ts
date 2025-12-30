import { Router } from 'express';
import { getWalletPnL } from '../controllers/pnl.controller';

const router = Router();

router.get('/:wallet/pnl', getWalletPnL);

export const pnlRoutes = router;
