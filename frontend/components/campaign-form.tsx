"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Campaign } from "@/types/campaign"

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  leads: z.array(z.string().url("Must be a valid URL")),
  accountIDs: z.array(z.string().min(1, "Account ID cannot be empty")),
})

interface CampaignFormProps {
  onSubmit: (data: Omit<Campaign, "_id">) => Promise<void>
  isSubmitting: boolean
  initialData?: Campaign
}

export function CampaignForm({ onSubmit, isSubmitting, initialData }: CampaignFormProps) {
  const [newLead, setNewLead] = useState("")
  const [newAccountID, setNewAccountID] = useState("")

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

  const handleAddLead = () => {
    if (!newLead) return

    try {
      // Basic URL validation
      new URL(newLead)

      const currentLeads = form.getValues("leads")
      if (!currentLeads.includes(newLead)) {
        form.setValue("leads", [...currentLeads, newLead])
      }
      setNewLead("")
    } catch (err) {
      form.setError("leads", { message: "Please enter a valid URL" })
    }
  }

  const handleRemoveLead = (index: number) => {
    const currentLeads = form.getValues("leads")
    form.setValue(
      "leads",
      currentLeads.filter((_, i) => i !== index),
    )
  }

  const handleAddAccountID = () => {
    if (!newAccountID) return

    const currentAccountIDs = form.getValues("accountIDs")
    if (!currentAccountIDs.includes(newAccountID)) {
      form.setValue("accountIDs", [...currentAccountIDs, newAccountID])
    }
    setNewAccountID("")
  }

  const handleRemoveAccountID = (index: number) => {
    const currentAccountIDs = form.getValues("accountIDs")
    form.setValue(
      "accountIDs",
      currentAccountIDs.filter((_, i) => i !== index),
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

        <FormField
          control={form.control}
          name="leads"
          render={() => (
            <FormItem>
              <FormLabel>LinkedIn Leads</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="https://linkedin.com/in/profile"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                />
                <Button type="button" onClick={handleAddLead} variant="outline">
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {form.getValues("leads").length > 0 ? (
                  <ul className="space-y-2">
                    {form.getValues("leads").map((lead, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm truncate">{lead}</span>
                        <Button type="button" onClick={() => handleRemoveLead(index)} variant="ghost" size="sm">
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No leads added yet</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountIDs"
          render={() => (
            <FormItem>
              <FormLabel>Account IDs</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter account ID"
                  value={newAccountID}
                  onChange={(e) => setNewAccountID(e.target.value)}
                />
                <Button type="button" onClick={handleAddAccountID} variant="outline">
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {form.getValues("accountIDs").length > 0 ? (
                  <ul className="space-y-2">
                    {form.getValues("accountIDs").map((id, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm">{id}</span>
                        <Button type="button" onClick={() => handleRemoveAccountID(index)} variant="ghost" size="sm">
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No account IDs added yet</p>
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
