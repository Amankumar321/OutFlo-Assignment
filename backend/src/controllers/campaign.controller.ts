import { Request, Response } from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} from '../services/campaign.service';

export const createCampaignHandler = async (req: Request, res: Response) => {
  try {
    const campaign = await createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getCampaignsHandler = async (req: Request, res: Response) => {
  try {
    const campaigns = await getCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCampaignHandler = async (req: Request, res: Response) => {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateCampaignHandler = async (req: Request, res: Response) => {
  try {
    const campaign = await updateCampaign(req.params.id, req.body);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteCampaignHandler = async (req: Request, res: Response) => {
  try {
    const campaign = await deleteCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json({ message: 'Campaign soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};