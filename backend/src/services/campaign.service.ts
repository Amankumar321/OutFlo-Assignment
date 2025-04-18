import { Campaign } from '../models/campaign.model';
import { ICampaign } from '../interfaces/campaign.interface';

export const createCampaign = async (campaignData: Partial<ICampaign>): Promise<ICampaign> => {
  const campaign = new Campaign(campaignData);
  return await campaign.save();
};

export const getCampaigns = async (): Promise<ICampaign[]> => {
  return await Campaign.find({ status: { $ne: 'DELETED' } });
};

export const getCampaignById = async (id: string): Promise<ICampaign | null> => {
  return await Campaign.findOne({_id: id, status: { $ne: 'DELETED' } });
};

export const updateCampaign = async (
  id: string,
  updateData: Partial<ICampaign>
): Promise<ICampaign | null> => {
  return await Campaign.findOneAndUpdate({_id: id, status: { $ne: 'DELETED' } }, updateData, { new: true });
};

export const deleteCampaign = async (id: string): Promise<ICampaign | null> => {
  return await Campaign.findByIdAndUpdate(
    id,
    { status: 'DELETED' },
    { new: true }
  );
};