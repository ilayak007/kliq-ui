/**
 * @file CampaignPage.tsx
 * @description This component displays the campaign details, including invited creators and matching creators.
 *              It fetches data from the backend API based on the campaign ID from the URL and renders the campaign workspace.
 * 
 * @author [Ilayaraja Kasirajan]
 * @created [18-Feb-2025]
 * @lastModified [23-Feb-2-25]
 */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignHeader } from "@/components/campaign-header";
import { InvitedCreators } from "@/components/invited-creators";
import { MatchingCreators } from "@/components/matching-creators";

/**
 * Interface representing a Creator.
 */
interface Creator {
  id: string;
  name: string;
  city: string;
  country: string;
  followers: string;
  platforms: string[];
  imageKey: string | null;
  imageUrl: string | null;
}

/**
 * Interface representing a Campaign.
 */
interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  launchDate: string;
  assignedBy: string;
  assignedChannels: string[];
  imageUrl: string;
  assignedImageUrl: string | null;
  campaignCreatedDate: string;
  isActive: boolean;
  invitedCreators: InvitedCreator[];
}

/**
 * Interface representing an Invited Creator.
 */
interface InvitedCreator {
  id: string;
  campaignId: string;
  creatorId: string;
  creator: Creator;
}

/**
 * Interface representing the Campaign data response.
 */
interface CampaignData {
  campaign: Campaign;
  invitedCreators: InvitedCreator[];
}

/**
 * CampaignPage Component
 * 
 * This component displays the details of a specific campaign, including:
 * - Campaign header with details like name, budget, etc.
 * - List of invited creators with options to manage invitations.
 * - Matching creators section to invite new creators.
 * 
 * The component fetches campaign data from the backend API using the campaign ID from the URL.
 */
export default function CampaignPage() {
  const params = useParams();
  const campaignId = params?.id as string | undefined;

  // State to hold the campaign data fetched from the backend
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  // Loading and error states for API call
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to manage matching creators for inviting
  const [matchingCreators, setMatchingCreators] = useState<Creator[]>([]);

  /**
   * Effect hook to fetch campaign data on component mount or when campaignId changes.
   */
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) return;

      try {
        setIsLoading(true);

        // Backend API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;

        // Fetch campaign data from backend
        const response = await axios.get(`${apiUrl}/campaigns/${campaignId}`);

        // Update state with fetched data
        setCampaignData(response.data);
      } catch (err) {
        // Handle error in fetching data
        setError("Failed to fetch campaign data");
        console.error(err);
      } finally {
        // Stop loading spinner
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  // Loading state
  if (isLoading) return <div className="text-white">Loading...</div>;

  // Error state
  if (error) return <div className="text-red-500">{error}</div>;

  // No data found state
  if (!campaignData) return <div className="text-white">No campaign data found</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header section with back navigation */}
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brand Workspace
          </Link>
        </header>

        {/* Main content area */}
        <main className="space-y-12">
          {/* Campaign Header with details */}
          <CampaignHeader campaign={campaignData.campaign} />

          {/* Invited Creators section */}
          <InvitedCreators
            creators={campaignData.campaign.invitedCreators ?? []}
            updateMatchingCreators={setMatchingCreators}
            campaignId={campaignData.campaign.id}
            isActive={campaignData.campaign.isActive}
          />

          {/* Matching Creators section for inviting new creators */}
          <MatchingCreators
            campaignId={campaignData.campaign.id}
            isActive={campaignData.campaign.isActive}
            matchingCreators={matchingCreators}
            setMatchingCreators={setMatchingCreators}
          />
        </main>
      </div>
    </div>
  );
}
