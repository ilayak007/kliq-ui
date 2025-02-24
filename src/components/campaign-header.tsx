/**
 * CampaignHeader Component
 * 
 * Displays campaign details, including status, description, budget, launch date, and assigned channels.
 * Allows launching a campaign and deleting it with confirmation.
 * Shows confetti on successful launch and toast notifications for feedback.
 * 
 * @author Ilayaraja Kasirajan
 * @created [20-Feb-2025]
 * @lastModified [23-Feb-2025]
 */

import { useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Wallet, Trash2 } from "lucide-react"
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
  // Local state management
  const [imageError, setImageError] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const [updatedLaunchDate, setUpdatedLaunchDate] = useState(campaign.launchDate)
  const [isActive, setIsActive] = useState(campaign.isActive)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { width, height } = useWindowSize()

  /**
   * Handles the "Launch Now" action for a campaign.
   * Updates the launch date and shows confetti upon success.
   */
  const handleLaunchNow = async () => {
    setIsLaunching(true)

    try {
      const today = new Date()
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL

      // API call to update the campaign's launch date
      await axios.put(`${apiUrl}/campaigns/${campaign.id}`, {
        launchDate: today.toISOString(),
      })

      const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Update local state on success
      setUpdatedLaunchDate(formattedDate)
      setIsActive(true)
      toast.success("🎉 Campaign launched successfully!")
      setShowConfetti(true)

      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 3500)

    } catch (error) {
      console.error("Error launching campaign:", error)
      toast.error("🚫 Failed to launch the campaign. Please try again.")
    } finally {
      setIsLaunching(false)
    }
  }

  /**
   * Handles the deletion of a campaign.
   * Shows a confirmation dialog and redirects on success.
   */
  const handleDeleteCampaign = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
      await axios.delete(`${apiUrl}/campaigns/${campaign.id}`)
      toast.success("✅ Campaign deleted successfully!")
      setShowDeleteDialog(false)

      // Redirect to homepage after deletion
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("🚫 Failed to delete the campaign.")
    }
  }

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left section - Campaign details */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Campaign Status */}
            {isActive ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-emerald-900/50 text-emerald-400 rounded-full">
                Active
              </span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-900/50 text-yellow-400 rounded-full">
                Draft
              </span>
            )}

            {/* Campaign Title & Description */}
            <h1 className="text-4xl font-bold">{campaign.name}</h1>
            <p className="text-gray-400">{campaign.description}</p>
          </div>

          {/* Assigned By Info */}
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

          {/* Budget & Launch Date */}
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

              {/* Launch Now Button */}
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

          {/* Assigned Channels & Delete Button */}
          <div className="grid grid-cols-2 gap-6">
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

            {/* Delete Campaign Button (visible if inactive) */}
            {!isActive && (
              <div className="relative">
                <span title="Delete Campaign">
                  <Trash2 className="h-6 w-6 text-red-500 cursor-pointer" onClick={() => setShowDeleteDialog(true)} />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right section - Campaign Image */}
        <div className="relative h-[260px] md:h-[360px] rounded-xl overflow-hidden bg-white flex items-center justify-center">
          <Image
            src={campaign.imageUrl || "/placeholder.svg"}
            alt={campaign.name}
            fill
            className="object-contain p-0"
          />
        </div>
        </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4 text-black">Are you sure you want to delete this campaign?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteCampaign}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
