import { useState } from "react"
import Image from "next/image"
import { Instagram, Youtube, Wallet, Circle, Music } from "lucide-react"

interface CampaignHeaderProps {
  campaign: {
    id: string
    name: string
    description: string
    assignedBy: string
    assignedImageUrl: string | null
    budget: number
    launchDate: string
    assignedChannels: string[]
    imageUrl: string
    campaignCreatedDate: string
    isActive: boolean
  }
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  const [imageError, setImageError] = useState(false)
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
        {/* <span className="inline-block px-2 py-1 text-xs font-semibold bg-emerald-900/50 text-emerald-400 rounded-full">
            Activated
          </span>  */}

{campaign.isActive ? (
  <span className="inline-block px-2 py-1 text-xs font-semibold bg-emerald-900/50 text-emerald-400 rounded-full">
    Activated
  </span>
) : (
  <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-900/50 text-yellow-400 rounded-full">
    Drafted
  </span>
)}

          <h1 className="text-4xl font-bold">{campaign.name}</h1>
          <p className="text-gray-400">{campaign.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={imageError ? "/placeholder.jpg" : campaign.assignedImageUrl || "/placeholder.jpg"}
            alt="Assigned By"
            width={40}
            height={40}
            className="rounded-lg"
            onError={() => setImageError(true)}
          />
          <div>
            <p className="font-medium">{campaign.assignedBy}</p>
            <p className="text-sm text-gray-400">
              Created on {campaign.campaignCreatedDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Assigned Budget</p>
            <div className="flex items-center gap-2">
              {/* <DollarSign className="h-4 w-4 text-gray-400" /> */}
              <Wallet className="h-4 w-4 text-gray-400" />
            <span>SAR {campaign.budget.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Launch Date</p>
            <div className="flex items-center gap-2">
              {/* <Calendar className="h-4 w-4 text-gray-400" /> */}
              <span className="text-gray-400">🚀</span> 
              {/* <span>{new Date(campaign.launchDate).toLocaleDateString()}</span> */}
              <span>{campaign.launchDate}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-3">Assigned Channels</p>
          <div className="flex gap-3">
            {campaign.assignedChannels.map((channel) => (
              <div key={channel} className="w-8 h-8 flex items-center justify-center rounded bg-gray-700">
                {channel === "Instagram" && <Instagram className="w-5 h-5" />}
                {channel === "YouTube" && <Youtube className="w-5 h-5" />}
                {channel === "Snapchat" && <Circle className="h-6 w-6 " />}
                {channel === "TikTok" && <Music className="h-6 w-6 " />}
                {/* Add other channel icons as needed */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
        <Image
          src={campaign.imageUrl || "/placeholder.svg"}
          alt="{campaign.name}"
          fill
          className="object-contain p-8"
        />
      </div>
    </div>
  )
}
