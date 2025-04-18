import { Request, Response } from 'express';
import { scrapeLinkedInProfiles, getProfilesFromDB } from '../services/scraper.service';
import { LinkedInProfile } from '../models/linkedinProfile.model';

export const scrapeProfiles = async (req: Request, res: Response) => {
  try {
    const { searchUrl, maxProfiles = 20 } = req.body;

    if (!searchUrl) {
      return res.status(400).json({ error: 'Valid LinkedIn search URL is required' });
    }

    const profiles = await scrapeLinkedInProfiles({
      searchUrl,
      maxProfiles
    });

    const operations = profiles
      .filter(p => p?.profileUrl)
      .map(profile => ({
        updateOne: {
          filter: { profileUrl: profile.profileUrl },
          update: { $set: profile },
          upsert: true
        }
      }));

    if (operations.length > 0) {
      await LinkedInProfile.bulkWrite(operations);
    }

    res.status(200).json({
      message: 'Successfully scraped profiles',
      count: profiles.length,
      profiles
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await getProfilesFromDB();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};