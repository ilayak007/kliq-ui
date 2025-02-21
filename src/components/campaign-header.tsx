import { useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Wallet } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import toast, { Toaster } from "react-hot-toast"
import { TikTokIcon, InstagramIcon, SnapchatIcon, YouTubeIcon } from "@/components/icons"

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
  const [isLaunching, setIsLaunching] = useState(false)
  const [updatedLaunchDate, setUpdatedLaunchDate] = useState(campaign.launchDate)
  const [isActive, setIsActive] = useState(campaign.isActive)
  const [showConfetti, setShowConfetti] = useState(false)

  const { width, height } = useWindowSize()

  const handleLaunchNow = async () => {
    setIsLaunching(true)

    try {
      const today = new Date()

      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      // Make API call to update the campaign
      await axios.put(`${apiUrl}/campaigns/${campaign.id}`, {
        launchDate: today.toISOString(),
      })

      const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Update UI state after successful API call
      setUpdatedLaunchDate(formattedDate)
      setIsActive(true)

      toast.success("🎉 Campaign launched successfully!")

      setShowConfetti(true)

      setTimeout(() => setShowConfetti(false), 3000)
    } catch (error) {
      console.error("Error launching campaign:", error)
      toast.error("🚫 Failed to launch the campaign. Please try again.")
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <div className="relative">
      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            {isActive ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-emerald-900/50 text-emerald-400 rounded-full">
                Active
              </span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-900/50 text-yellow-400 rounded-full">
                Draft
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
                <Wallet className="h-4 w-4 text-gray-400" />
                <span>SAR {campaign.budget.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Launch Date</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🚀</span>
                  <span>{updatedLaunchDate}</span>
                </div>
              </div>

              {/* Conditionally render Launch Now button */}
              {!isActive && (
                <button
                  onClick={handleLaunchNow}
                  disabled={isLaunching}
                  className={`ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition ${
                    isLaunching ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLaunching ? "Launching..." : "Launch Now"}
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Assigned Channels</p>
            <div className="flex gap-3">
              {campaign.assignedChannels.map((channel) => (
                <div key={channel} className="w-8 h-8 flex items-center justify-center rounded bg-gray-700">
                  {channel === "Instagram" && <InstagramIcon />}
                  {channel === "YouTube" && <YouTubeIcon />}
                  {channel === "Snapchat" && <SnapchatIcon />}
                  {channel === "TikTok" && <TikTokIcon />}
                </div>
              ))}
            </div>
          </div>
        </div>

      <div className="relative h-65 md:h-90 rounded-xl overflow-hidden bg-white flex items-center justify-center">
        <Image
          src={campaign.imageUrl || "/placeholder.svg"}
          alt={campaign.name}
          fill
          className="object-cover p-0"
        />
      </div>

      


      </div>
    </div>
  )
}
