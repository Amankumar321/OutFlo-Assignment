import { Document } from 'mongoose';

export interface ILinkedInProfile extends Document {
  fullName: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  scrapedAt: Date;
}