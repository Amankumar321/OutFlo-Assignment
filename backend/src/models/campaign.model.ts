import { Schema, model } from 'mongoose';
import { ICampaign } from '../interfaces/campaign.interface';

const leadSchema = new Schema({
  url: { type: String, required: true }
});

const campaignSchema = new Schema<ICampaign>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE'
  },
  leads: [leadSchema],
  accountIDs: [{ type: String }]
}, {
  timestamps: true
});

export const Campaign = model<ICampaign>('Campaign', campaignSchema);