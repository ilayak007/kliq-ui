import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube } from "lucide-react"

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
  }
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">
      <div className="relative">
        <Image
          src={creator.imageUrl || "/placeholder.svg"}
          alt={creator.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Invite Sent</span>
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
            {/* Add more icons for platforms if needed */}
          </div>
        ))}
      </div>

      <Button variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-sm">
        Cancel Invite
      </Button>
    </div>
  )
}
