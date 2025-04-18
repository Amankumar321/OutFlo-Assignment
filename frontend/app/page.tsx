import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Campaign Management System",
  description: "Manage your outreach campaigns and generate personalized messages",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="w-full flex items-center justify-between py-4 px-4">
          <Link href="/">
            <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
          </Link>
          <nav className="flex items-center sm:gap-2">
            <Link href="/campaigns">
              <Button variant="ghost">Campaigns</Button>
            </Link>
            <Link href="/message-generator">
              <Button variant="ghost">Message Generator</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-10 px-10 container self-center">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 max-w-xl">
            <div className="flex flex-col space-y-1.5 pb-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Campaign Management</h3>
              <p className="text-sm text-muted-foreground">Create, update, and manage your outreach campaigns</p>
            </div>
            <div className="flex flex-col gap-8">
              <p>
                Manage your campaigns with easy-to-use tools for creating, updating, and tracking your outreach efforts.
              </p>
              <Link href="/campaigns">
                <Button className="w-full">View Campaigns</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 max-w-xl">
            <div className="flex flex-col space-y-1.5 pb-4">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Message Generator</h3>
              <p className="text-sm text-muted-foreground">Generate personalized outreach messages</p>
            </div>
            <div className="flex flex-col gap-8">
              <p>Create personalized outreach messages based on LinkedIn profile data using AI technology.</p>
              <Link href="/message-generator">
                <Button className="w-full">Generate Messages</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between px-2 gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 Campaign Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
