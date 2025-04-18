"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { CampaignList } from "@/components/campaign-list"
import type { Campaign } from "@/types/campaign"
import { fetchCampaigns } from "@/lib/api"

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true)
        const data = await fetchCampaigns()
        setCampaigns(data)
      } catch (err) {
        setError("Failed to load campaigns. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <header className="w-full border-b mb-10">
        <div className="w-full flex items-center justify-between py-4 px-4">
          <Link href="/">
            <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
          </Link>
          <nav className="flex items-center sm:gap-2">
            <Link href="/campaigns">
              <Button size="sm" className="px-2" variant="ghost">Campaigns</Button>
            </Link>
            <Link href="/message-generator">
              <Button size="sm" className="px-2" variant="ghost">Message Generator</Button>
            </Link>
          </nav>
        </div>
      </header>
      <div className="container px-4 pb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">Manage your outreach campaigns</p>
          </div>
          <Link href="/campaigns/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-10">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-muted-foreground">No campaigns found</div>
                <Link href="/campaigns/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create your first campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CampaignList campaigns={campaigns} />
        )}
      </div>
    </div>
  )
}
