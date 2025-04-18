import { Document } from 'mongoose';


export interface ICampaign extends Document {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: string[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}