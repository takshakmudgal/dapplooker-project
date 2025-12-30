import { Router } from 'express';
import { getInsight } from '../controllers/insight.controller';

const router = Router();

router.post('/:id/insight', getInsight);

export const insightRoutes = router;
