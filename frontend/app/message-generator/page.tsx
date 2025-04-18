"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageGeneratorForm } from "@/components/message-generator-form"
import type { LinkedInProfile } from "@/types/linkedin-profile"
import { generatePersonalizedMessage } from "@/lib/api"

export default function MessageGeneratorPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (profileData: LinkedInProfile) => {
    try {
      setIsGenerating(true)
      setError(null)
      setMessage(null)
      const response = await generatePersonalizedMessage(profileData)
      setMessage(response.message)
    } catch (err) {
      setError("Failed to generate message. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">LinkedIn Message Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate personalized outreach messages based on LinkedIn profile data
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Enter LinkedIn profile details to generate a personalized message</CardDescription>
            </CardHeader>
            <CardContent>
              <MessageGeneratorForm onSubmit={handleSubmit} isSubmitting={isGenerating} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Message</CardTitle>
              <CardDescription>Your personalized outreach message will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">{error}</div>
              ) : message ? (
                <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-wrap">{message}</div>
              ) : (
                <div className="flex justify-center items-center h-48 text-muted-foreground text-center">
                  <p>Fill out the form and click "Generate Message" to create a personalized outreach message</p>
                </div>
              )}
            </CardContent>
            {message && (
              <CardFooter>
                <Button onClick={() => navigator.clipboard.writeText(message)} variant="outline" className="w-full">
                  Copy to Clipboard
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
