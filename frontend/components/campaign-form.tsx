"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Campaign } from "@/types/campaign"
import { fetchProfiles, scrapeProfiles } from "@/lib/api"

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  leads: z.array(z.string().url("Must be a valid URL")),
  accountIDs: z.array(z.string().min(1, "Account ID cannot be empty")),
})

interface LinkedInProfile {
  _id: string
  fullName: string
  jobTitle: string
  company: string
  location: string
  profileUrl: string
}

interface CampaignFormProps {
  onSubmit: (data: Omit<Campaign, "_id">) => Promise<void>
  isSubmitting: boolean
  initialData?: Campaign
}

export function CampaignForm({ onSubmit, isSubmitting, initialData }: CampaignFormProps) {
  const [searchUrl, setSearchUrl] = useState("")
  const [isScraping, setIsScraping] = useState(false)
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([])
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: "",
          description: "",
          status: "ACTIVE",
          leads: [],
          accountIDs: [],
        },
  })

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await fetchProfiles()
        setProfiles(data)
      } catch (error) {
        console.error("Error loading profiles:", error)
      }
    }
    loadProfiles()
  }, [])

  const handleScrape = async () => {
    if (!searchUrl) return
    setIsScraping(true)
    try {
      const data = await scrapeProfiles(searchUrl)
      setProfiles(data)
    } catch (error) {
      alert("Scraping failed:" + error)
    } finally {
      setIsScraping(false)
    }
  }

  const handleAddSelectedProfiles = () => {
    if (selectedProfiles.length === 0) return

    const selectedProfileData = profiles.filter(profile => 
      selectedProfiles.includes(profile._id)
    )

    // Update leads and accountIDs in the form
    const currentLeads = form.getValues("leads")
    const currentAccountIDs = form.getValues("accountIDs")
    
    const newLeads = [...currentLeads]
    const newAccountIDs = [...currentAccountIDs]

    selectedProfileData.forEach(profile => {
      if (!currentLeads.includes(profile.profileUrl)) {
        newLeads.push(profile.profileUrl)
        newAccountIDs.push(profile._id)
      }
    })

    form.setValue("leads", newLeads)
    form.setValue("accountIDs", newAccountIDs)
    setSelectedProfiles([])
  }

  const handleRemoveLead = (index: number) => {
    const currentLeads = form.getValues("leads")
    const currentAccountIDs = form.getValues("accountIDs")
    
    form.setValue(
      "leads",
      currentLeads.filter((_, i) => i !== index),
    )
    form.setValue(
      "accountIDs",
      currentAccountIDs.filter((_, i) => i !== index),
    )
  }

  const toggleProfileSelection = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter campaign description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Active</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Inactive</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LinkedIn Profile Scraping Section */}
        <div className="space-y-4">
          <FormLabel>LinkedIn Profile Scraper</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter LinkedIn search URL"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleScrape} 
              disabled={isScraping || !searchUrl}
            >
              {isScraping ? "Scraping..." : "Scrape Profiles"}
            </Button>
          </div>

          {profiles.length > 0 && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Scraped Profiles</h3>
                <Button 
                  type="button" 
                  onClick={handleAddSelectedProfiles} 
                  disabled={selectedProfiles.length === 0}
                  size="sm"
                >
                  Add Selected
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {profiles.map(profile => (
                  <div 
                    key={profile._id} 
                    className={`p-3 rounded-md border cursor-pointer ${selectedProfiles.includes(profile._id) ? 'bg-muted' : ''}`}
                    onClick={() => toggleProfileSelection(profile._id)}
                  >
                    <div className="font-medium">{profile.fullName}</div>
                    <div className="text-sm text-muted-foreground">{profile.jobTitle} at {profile.company}</div>
                    <div className="text-xs text-muted-foreground">{profile.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Leads Section */}
        <FormField
          control={form.control}
          name="leads"
          render={() => (
            <FormItem>
              <FormLabel>Selected Leads</FormLabel>
              <div className="mt-2">
                {form.getValues("leads").length > 0 ? (
                  <ul className="space-y-2">
                    {form.getValues("leads").map((lead, index) => {
                      const profile = profiles.find(p => p.profileUrl === lead)
                      return (
                        <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="max-w-full">
                            <span className="font-medium break-all">{profile?.fullName || lead}</span>
                            {profile && (
                              <div className="text-sm text-muted-foreground">
                                {profile.jobTitle} at {profile.company}
                              </div>
                            )}
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleRemoveLead(index)} 
                            variant="ghost" 
                            size="sm"
                          >
                            Remove
                          </Button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No leads added yet</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  )
}