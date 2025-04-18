"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { CampaignForm } from "@/components/campaign-form"
import type { Campaign } from "@/types/campaign"
import { fetchCampaign, updateCampaign } from "@/lib/api"

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setIsLoading(true)
        const data = await fetchCampaign(params.id)
        setCampaign(data)
      } catch (err) {
        setError("Failed to load campaign details. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaign()
  }, [params.id])

  const handleSubmit = async (campaignData: Omit<Campaign, "_id">) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await updateCampaign(params.id, campaignData)
      router.push(`/campaigns/${params.id}`)
      router.refresh()
    } catch (err) {
      setError("Failed to update campaign. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="container py-10 px-2">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="container py-10 px-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">{error || "Campaign not found"}</div>
              <div className="flex justify-center mt-4">
                <Link href="/campaigns">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Campaigns
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="container py-10 px-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/campaigns/${params.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Campaign</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Edit Campaign Details</CardTitle>
              <CardDescription>Update the details for your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <CampaignForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={campaign} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
