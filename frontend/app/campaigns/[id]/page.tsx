"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, ExternalLink } from "lucide-react"
import type { Campaign } from "@/types/campaign"
import { fetchCampaign, deleteCampaign } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCampaign(params.id)
      router.push("/campaigns")
      router.refresh()
    } catch (err) {
      setError("Failed to delete campaign. Please try again.")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center">
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
      <div className="w-full flex flex-col items-center">
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
    <div className="w-full flex flex-col items-center">
      <div className="container py-10 px-2">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/campaigns">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
          <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-muted-foreground">{campaign.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Leads ({campaign.leads.length})</h3>
                    {campaign.leads.length > 0 ? (
                      <ul className="space-y-2">
                        {campaign.leads.map((lead, index) => (
                          <li key={index} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a
                              href={lead}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline truncate"
                            >
                              {lead}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No leads added yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Account IDs ({campaign.accountIDs.length})</h3>
                    {campaign.accountIDs.length > 0 ? (
                      <ul className="space-y-1">
                        {campaign.accountIDs.map((id, index) => (
                          <li key={index} className="text-sm">
                            {id}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No account IDs added yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/campaigns/${params.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Campaign
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete Campaign"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the campaign as deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Current Status</h3>
                    <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"} className="mt-1">
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium">Leads Count</h3>
                    <p className="text-2xl font-bold">{campaign.leads.length}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Account IDs Count</h3>
                    <p className="text-2xl font-bold">{campaign.accountIDs.length}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/campaigns/${params.id}/edit`} className="w-full">
                  <Button className="w-full">Manage Campaign</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
