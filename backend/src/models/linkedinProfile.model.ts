import { Schema, model } from 'mongoose';
import { ILinkedInProfile } from '../interfaces/scraper.interface';

const linkedInProfileSchema = new Schema<ILinkedInProfile>({
  fullName: { type: String, required: true },
  jobTitle: { type: String },
  company: { type: String },
  location: { type: String },
  profileUrl: { type: String, required: true, unique: true },
  scrapedAt: { type: Date, default: Date.now }
});

export const LinkedInProfile = model<ILinkedInProfile>('LinkedInProfile', linkedInProfileSchema);