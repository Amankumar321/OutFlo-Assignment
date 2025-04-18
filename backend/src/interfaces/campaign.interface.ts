import { Document } from 'mongoose';

export interface ILead {
  url: string;
}

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: ILead[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}