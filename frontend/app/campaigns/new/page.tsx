"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CampaignForm } from "@/components/campaign-form"
import type { Campaign } from "@/types/campaign"
import { createCampaign } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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
    <div className="w-full flex flex-col items-center justify-center">
      <div className="container py-10 px-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
          </div>

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
    </div>
  )
}
