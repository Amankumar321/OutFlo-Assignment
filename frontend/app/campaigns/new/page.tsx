"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CampaignForm } from "@/components/campaign-form"
import type { Campaign } from "@/types/campaign"
import { createCampaign } from "@/lib/api"

export default function NewCampaignPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (campaignData: Omit<Campaign, "_id">) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await createCampaign(campaignData)
      router.push("/campaigns")
      router.refresh()
    } catch (err) {
      setError("Failed to create campaign. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Campaign</h1>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Enter the details for your new outreach campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <CampaignForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
