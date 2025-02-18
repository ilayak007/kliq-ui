"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CampaignHeader } from "@/components/campaign-header"
import { InvitedCreators } from "@/components/invited-creators"
import { MatchingCreators } from "@/components/matching-creators"

interface Campaign {
  id: string
  name: string
  description: string
  budget: number
  launchDate: string
  assignedBy: string
  assignedChannels: string[]
  imageUrl: string
  assignedImageUrl: string | null
  campaignCreatedDate: string
  isActive: boolean
  invitedCreators: InvitedCreator[]
}

interface Creator {
  id: string
  name: string
  city: string
  country: string
  followers: string
  platforms: string[]
  imageUrl: string | null
  imageKey: string | null
}

interface InvitedCreator {
  id: string
  campaignId: string
  creatorId: string
  creator: Creator
}

interface CampaignData {
  campaign: Campaign
  invitedCreators: InvitedCreator[]
}

export default function CampaignPage() {
  const params = useParams() // ✅ Use `useParams` to get dynamic route params safely
  const campaignId = params?.id as string | undefined // ✅ Ensure it's a string
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaignData = async () => {
      console.log('here')  
      if (!campaignId) return // ✅ Prevents API call if campaignId is undefined

      try {
        setIsLoading(true)
        const response = await axios.get(`https://kliq-service.vercel.app/campaigns/${campaignId}`)
        console.log("✅ API Response:", response.data)
        setCampaignData(response.data)
      } catch (err) {
        setError("Failed to fetch campaign data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignData()
  }, [campaignId]) // ✅ Depend on `campaignId`, not `params.id`

  if (isLoading) return <div className="text-white">Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!campaignData) return <div className="text-white">No campaign data found</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brand Workspace
          </Link>
        </header>

        <main className="space-y-12">
          <CampaignHeader campaign={campaignData.campaign} />          
          <InvitedCreators creators={campaignData?.campaign?.invitedCreators ?? []} />
          <MatchingCreators />
        </main>
      </div>
    </div>
  )
}
