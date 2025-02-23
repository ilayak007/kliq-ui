/**
 * CreatorCard Component
 * 
 * Displays a creator's profile information, including their image, name, location, followers, and platforms.
 * Provides functionality to send or cancel an invite to the creator.
 * 
 * @author Ilayaraja Kasirajan
 * @created [19-Feb-2025]
 * @lastModified [23-Feb-2025]
 */

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
    campaignId: string;
  };
  isInvited: boolean; // Indicates if the creator has already been invited
  onRemove: (creatorId: string) => void; // Callback to remove the creator from the list after action
}

export function CreatorCard({ creator, isInvited, onRemove }: CreatorCardProps) {
  const [imageError, setImageError] = useState(false); // Handles image load errors

  /**
   * Handles sending or canceling an invite based on the current state.
   * Makes API calls to the backend and updates UI with toast notifications.
   */
  const handleAction = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;

      if (isInvited) {
        // Cancel invite API call
        await axios.delete(`${apiUrl}/invited-creators`, {
          data: { campaignId: creator.campaignId, creatorId: creator.id },
        });
        toast.success("Invite canceled", { autoClose: 2000 });
      } else {
        // Send invite API call
        await axios.post(`${apiUrl}/invited-creators`, {
          campaignId: creator.campaignId,
          creatorId: creator.id,
        });
        toast.success("Invite sent", { autoClose: 2000 });
      }

      // Notify parent to update the list
      onRemove(creator.id);
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action");
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">
      {/* Creator Image */}
      <div className="relative">
        <Image
          src={imageError ? "/placeholder.jpg" : creator.imageUrl || "/placeholder.jpg"}
          alt={creator.name}
          width={200}
          height={200}
          className="w-full aspect-square object-cover rounded-lg"
          onError={() => setImageError(true)} // Fallback on image load error
        />
        {/* Invite Sent Badge */}
        {isInvited && (
          <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
            Invite Sent
          </span>
        )}
      </div>

      {/* Creator Details */}
      <div className="space-y-2">
        <h3 className="font-semibold">{creator.name}</h3>
        <p className="text-sm text-gray-400">{`${creator.city}, ${creator.country}`}</p>
        <p className="text-sm text-gray-400">{`${creator.followers} Followers`}</p>
      </div>

      {/* Social Media Platforms */}
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

      {/* Action Button: Send or Cancel Invite */}
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
