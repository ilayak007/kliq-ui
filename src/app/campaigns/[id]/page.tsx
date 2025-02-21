"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CampaignHeader } from "@/components/campaign-header";
import { InvitedCreators } from "@/components/invited-creators";
import { MatchingCreators } from "@/components/matching-creators";

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

export default function CampaignPage() {
  const params = useParams();
  const campaignId = params?.id as string | undefined;
  const [campaignData, setCampaignData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matchingCreators, setMatchingCreators] = useState<Creator[]>([]); // ✅ Ensure correct typing

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!campaignId) return;

      try {
        setIsLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
        const response = await axios.get(`${apiUrl}/campaigns/${campaignId}`);
        setCampaignData(response.data);
      } catch (err) {
        setError("Failed to fetch campaign data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    };

    fetchCampaignData();
  }, [campaignId]);

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
          {/* <InvitedCreators creators={campaignData?.campaign?.invitedCreators ?? []} />
          <MatchingCreators 
             campaignId={campaignData?.campaign?.id} 
            isActive={campaignData?.campaign?.isActive} 
          /> */}

       <InvitedCreators
           creators={campaignData.campaign.invitedCreators ?? []}
           updateMatchingCreators={setMatchingCreators} // ✅ Fix here
           campaignId={campaignData.campaign.id}
           isActive={campaignData.campaign.isActive}
         />

         <MatchingCreators
           campaignId={campaignData.campaign.id}
           isActive={campaignData.campaign.isActive}
           matchingCreators={matchingCreators}
           setMatchingCreators={setMatchingCreators}
         />
        </main>
      </div>
    </div>
  )

  // return (
  //   <div className="min-h-screen bg-black text-white">
  //     <div className="max-w-7xl mx-auto px-4 py-6">
  //       <CampaignHeader campaign={campaignData.campaign} />

  //       {/* ✅ Pass setMatchingCreators correctly */}
  //       <InvitedCreators
  //         creators={campaignData.campaign.invitedCreators ?? []}
  //         updateMatchingCreators={setMatchingCreators} // ✅ Fix here
  //         campaignId={campaignData.campaign.id}
  //       />

  //       <MatchingCreators
  //         campaignId={campaignData.campaign.id}
  //         isActive={campaignData.campaign.isActive}
  //         matchingCreators={matchingCreators}
  //         setMatchingCreators={setMatchingCreators}
  //       />
  //     </div>
  //   </div>
  // );
}
