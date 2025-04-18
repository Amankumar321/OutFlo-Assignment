import axios from 'axios';
import { ILinkedInProfile, IMessageResponse } from '../interfaces/message.interface';
import { config } from 'dotenv';

config();

export const generatePersonalizedMessage = async (
  profileData: ILinkedInProfile
): Promise<IMessageResponse> => {
  try {
    const prompt = `
    OutFlo is a next-gen outreach automation tool designed for sales teams and lead-gen agencies to scale their outbound workflows, starting with LinkedIn.
    
    - Book 10x more meetings on autopilot while ensuring no follow-ups or replies are missed.
    - Save 95% of your time by automating chaotic, manual outreach across multiple accounts.
    - Cut down costs with our flat-fee pricing, no matter how many LinkedIn accounts you manage.

    Get early access at https://www.outflo.in/

    Create a personalized outreach message for ${profileData.name}, who is a ${profileData.job_title} at ${profileData.company} located in ${profileData.location}. Their profile summary: ${profileData.summary}.
    
    Example Response: Hey John, I see you are working as a Software Engineer at TechCorp. Outflo can help automate your outreach to increase meetings & sales. Let's connect!
    
    Reply with only personalized outreach message.
    Response:`;

    const response = await axios.post(
      process.env.LLM_ENDPOINT || "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.LLM_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const message = response.data.choices[0].message.content.trim();
    return { message };
  } catch (error) {
    console.error('Error generating message:', error);
    throw new Error('Failed to generate personalized message');
  }
};