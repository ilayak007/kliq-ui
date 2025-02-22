"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CampaignForm } from "@/components/campaign-form";
import axios from "axios";
import { uploadToS3 } from "@/utils/uploadToS3";
import { toast } from "react-toastify";
import Image from "next/image";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const campaignName = formData.get("name") as string;
      const imageKey = campaignName.toLowerCase().replace(/\s+/g, "_") + ".jpg"; 
      const description = formData.get("description") as string;
      const budget = parseFloat(formData.get("budget") as string);
      const launchDate = formData.get("launchDate") as string;
      const assignedBy = "Admin"; 
      const assignedChannels = formData.getAll("channels") as string[];
      const image = formData.get("image") as File;  

      const campaignData = {
        name: campaignName,
        description,
        budget,
        launchDate: new Date(launchDate).toISOString(), 
        assignedBy,
        assignedChannels,
        imageKey: imageKey,
      };

      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      const response = await axios.post(`${apiUrl}/campaigns`, campaignData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.status);
      const s3Url = await uploadToS3(image, imageKey);
      console.log(s3Url);

      toast.success("Campaign created successfully!", { autoClose: 2000 });
      router.push("/?source=create_campaign");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        <header className="mb-8 flex items-center w-full">
          {/* Left: Back to Campaigns */}
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>

          {/* Spacer to push the logo to the extreme right */}
          <div className="flex-grow"></div>

          {/* Right: Kliq Logo */}
          <Link href={"/"}>
              <Image
                src="https://cdn.prod.website-files.com/66ab3fc8f9140f3bdf6a36a5/66ab3fc8f9140f3bdf6a36fd_kliq-logo.svg"
                alt="Kliq Logo"
                width={100}
                height={25}
                className="hover:scale-110 transition-transform duration-300"
              />
          </Link>
        </header>

        <main>
          <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
          <CampaignForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </main>
      </div>
    </div>
  );
}
