import type { Campaign } from "@/types/campaign"
import type { LinkedInProfile } from "@/types/linkedin-profile"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Campaign APIs
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch(`${API_URL}/campaigns`)
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch campaigns:", error)
    return []
  }
}

export async function fetchCampaign(id: string): Promise<Campaign | undefined> {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch campaign ${id}:`, error)
  }
}

export async function createCampaign(campaign: Omit<Campaign, "_id">): Promise<Campaign | undefined> {
  try {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaign),
    })

    return await response.json()
  } catch (error) {
    console.error("Failed to create campaign:", error)
  }
}

export async function updateCampaign(id: string, campaign: Omit<Campaign, "_id">): Promise<Campaign | undefined> {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaign),
    })

    return await response.json()
  } catch (error) {
    console.error(`Failed to update campaign ${id}:`, error)

  }
}

export async function deleteCampaign(id: string): Promise<void> {
  try {
    if (!API_URL) {
      // Mock delete for demo
      return
    }

    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to delete campaign ${id}:`, error)
    throw error
  }
}

// LinkedIn Message API
export async function generatePersonalizedMessage(profile: LinkedInProfile): Promise<{ message: string } | undefined> {
  try {
    const response = await fetch(`${API_URL}/personalized-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to generate personalized message:", error)
  }
}
