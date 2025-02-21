import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TikTokIcon, InstagramIcon, SnapchatIcon, YouTubeIcon } from "@/components/icons";
import axios from "axios";
import { toast } from "react-toastify";

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    city: string;
    country: string;
    followers: string;
    platforms: string[];
    imageKey: string | null;
    imageUrl: string | null;
    campaignId: string; // ✅ Ensure this is included
  };
  isInvited: boolean;
  onRemove: (creatorId: string) => void;
}

export function CreatorCard({ creator, isInvited, onRemove }: CreatorCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleAction = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;

      if (isInvited) {
        await axios.delete(`${apiUrl}/invited-creators`, {
          data: { campaignId: creator.campaignId, creatorId: creator.id },
        });
        toast.success("Invite canceled", { autoClose: 2000 });
      } else {
        await axios.post(`${apiUrl}/invited-creators`, {
          campaignId: creator.campaignId,
          creatorId: creator.id,
        });
        toast.success("Invite sent", { autoClose: 2000 });
      }

      onRemove(creator.id);
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action");
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">
      <div className="relative">
        <Image
          src={imageError ? "/placeholder.jpg" : creator.imageUrl || "/placeholder.jpg"}
          alt={creator.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg"
          onError={() => setImageError(true)}
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
            {platform.toLowerCase() === "instagram" && <InstagramIcon />}
            {platform.toLowerCase() === "youtube" && <YouTubeIcon />}
            {platform.toLowerCase() === "snapchat" && <SnapchatIcon />}
            {platform.toLowerCase() === "tiktok" && <TikTokIcon />}
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-sm"
        onClick={handleAction}
      >
        {isInvited ? "Cancel Invite" : "Send Invite"}
      </Button>
    </div>
  );
}
