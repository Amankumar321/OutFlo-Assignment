import express from 'express';
import { scrapeProfiles, getProfiles } from '../controllers/scraper.controller';

const router = express.Router();

router.post('/scrape', scrapeProfiles);
router.get('/profiles', getProfiles);

export default router;