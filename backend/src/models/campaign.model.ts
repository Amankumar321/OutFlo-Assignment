import { Schema, model } from 'mongoose';
import { ICampaign } from '../interfaces/campaign.interface';


const campaignSchema = new Schema<ICampaign>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE'
  },
  leads: [{ type: String }],
  accountIDs: [{ type: String }]
}, {
  timestamps: true
});

export const Campaign = model<ICampaign>('Campaign', campaignSchema);