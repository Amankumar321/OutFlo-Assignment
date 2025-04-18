"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit } from "lucide-react"
import type { Campaign } from "@/types/campaign"
import { updateCampaign } from "@/lib/api"

interface CampaignListProps {
  campaigns: Campaign[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const router = useRouter()
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const handleStatusToggle = async (campaign: Campaign) => {
    try {
      setUpdatingStatus((prev) => ({ ...prev, [campaign._id]: true }))
      const newStatus = campaign.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await updateCampaign(campaign._id, { ...campaign, status: newStatus })
      location.reload()
    } catch (err) {
      setError(`Failed to update status for ${campaign.name}`)
      console.error(err)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [campaign._id]: false }))
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded-md mb-4">{error}</div>}

      {campaigns.map((campaign) => (
        <Card key={campaign._id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  <Link href={`/campaigns/${campaign._id}`} className="hover:underline text-xl">
                    {campaign.name}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-1">{campaign.description}</CardDescription>
              </div>
              <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Leads</h4>
                <p className="text-sm text-muted-foreground">{campaign.leads.length} leads</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Account IDs</h4>
                <p className="text-sm text-muted-foreground">{campaign.accountIDs.length} accounts</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 items-start sm:flex-row sm:justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={campaign.status === "ACTIVE"}
                onCheckedChange={() => handleStatusToggle(campaign)}
                disabled={updatingStatus[campaign._id]}
              />
              <span className="text-sm">{updatingStatus[campaign._id] ? "Updating..." : "Active"}</span>
            </div>
            <div className="flex self-end space-x-2">
              <Link href={`/campaigns/${campaign._id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Link href={`/campaigns/${campaign._id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
