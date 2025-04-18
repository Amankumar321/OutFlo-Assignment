import { Router } from 'express';
import { generateMessageHandler } from '../controllers/message.controller';

const router = Router();

router.post('/', generateMessageHandler);

export default router;