import { Router } from 'express';
import {
  createCampaignHandler,
  getCampaignsHandler,
  getCampaignHandler,
  updateCampaignHandler,
  deleteCampaignHandler
} from '../controllers/campaign.controller';

const router = Router();

router.post('/', createCampaignHandler);
router.get('/', getCampaignsHandler);
router.get('/:id', getCampaignHandler);
router.put('/:id', updateCampaignHandler);
router.delete('/:id', deleteCampaignHandler);

export default router;