import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

interface CreatorCardProps {
  creator: {
    id: string
    name: string
    city: string
    country: string
    followers: string
    platforms: string[]
    imageKey: string | null
    imageUrl: string | null
    campaignId: string
  }
  isInvited: boolean // 🔹 New prop to determine button label
  onRemove: (creatorId: string) => void
}

export function CreatorCard({ creator, isInvited, onRemove }: CreatorCardProps) {
  const [imageError, setImageError] = useState(false) // ✅ Track image load failure

  const handleAction = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL

      if (isInvited) {
        // 🔹 Cancel Invite API Call
        await axios.delete(`${apiUrl}/invited-creators`, {
          data: { campaignId: creator.campaignId, creatorId: creator.id },
        })
        toast.success("Invite canceled")
      } else {
        // 🔹 Send Invite API Call
        await axios.post(`${apiUrl}/invited-creators`, {
          campaignId: creator.campaignId,
          creatorId: creator.id,
        })
        toast.success("Invite sent")
      }

      onRemove(creator.id) // Remove from Matching Creators on invite
    } catch (error) {
      console.error("Error processing action:", error)
      toast.error("Failed to process action")
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">
      <div className="relative">
        <Image
          src={imageError ? "/placeholder.jpg" : creator.imageUrl || "/placeholder.jpg"} // ✅ Prevent reloading missing image
          alt={creator.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg"
          onError={() => setImageError(true)} // ✅ Set imageError when image fails
        />
        {isInvited && <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Invite Sent</span>}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">{creator.name}</h3>
        <p className="text-sm text-gray-400">{`${creator.city}, ${creator.country}`}</p>
        <p className="text-sm text-gray-400">{`${creator.followers} Followers`}</p>
      </div>

      <div className="flex gap-2">
        {creator.platforms.map((platform) => (
          <div key={platform} className="w-8 h-8 flex items-center justify-center rounded bg-gray-700">
            {platform.toLowerCase() === "instagram" && <Instagram className="w-5 h-5 text-gray-400" />}
            {platform.toLowerCase() === "youtube" && <Youtube className="w-5 h-5 text-gray-400" />}
          </div>
        ))}
      </div>

      {/* 🔹 Button changes dynamically */}
      <Button
        variant="secondary"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-sm"
        onClick={handleAction}
      >
        {isInvited ? "Cancel Invite" : "Send Invite"}
      </Button>
    </div>
  )
}
