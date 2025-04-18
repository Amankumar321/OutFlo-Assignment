import { Request, Response } from 'express';
import { generatePersonalizedMessage } from '../services/message.service';
import { ILinkedInProfile } from '../interfaces/message.interface';

export const generateMessageHandler = async (req: Request, res: Response) => {
  try {
    const profileData: ILinkedInProfile = req.body;
    const response = await generatePersonalizedMessage(profileData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};