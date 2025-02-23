/**
 * @file NewCampaignPage.tsx
 * @description This component renders the "Create New Campaign" page, allowing users to input campaign details, upload an image,
 *              and submit the form to create a new campaign. It handles form submission, S3 image upload, and API integration.
 * 
 * @author [Ilayaraja Kasirajan]
 * @created [20-Feb-2025]
 * @lastModified [23-Feb-2025]
 */

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

/**
 * NewCampaignPage Component
 * 
 * This component renders a form to create a new campaign.
 * - Handles form submission and data validation.
 * - Uploads campaign images to AWS S3.
 * - Sends campaign details to the backend API.
 * - Provides user feedback with toast notifications.
 */
export default function NewCampaignPage() {
  const router = useRouter();

  // Tracks form submission state to disable inputs while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles form submission for creating a new campaign.
   * @param {FormData} formData - The form data submitted by the user.
   */
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true); // Start submission loading state

    try {
      // Extract form values
      const campaignName = formData.get("name") as string;
      const imageKey = campaignName.toLowerCase().replace(/\s+/g, "_") + ".jpg"; // Format image key for S3
      const description = formData.get("description") as string;
      const budget = parseFloat(formData.get("budget") as string);
      const launchDate = formData.get("launchDate") as string;
      const assignedBy = "Admin"; // Static value for now
      const assignedChannels = formData.getAll("channels") as string[];
      const image = formData.get("image") as File; // Image file for S3

      // Prepare campaign data payload
      const campaignData = {
        name: campaignName,
        description,
        budget,
        launchDate: new Date(launchDate).toISOString(), // Convert to ISO format
        assignedBy,
        assignedChannels,
        imageKey: imageKey,
      };

      // Send campaign data to backend API
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      const response = await axios.post(`${apiUrl}/campaigns`, campaignData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.status); // Log API response status

      // Upload campaign image to AWS S3
      const s3Url = await uploadToS3(image, imageKey);
      console.log(s3Url); // Log uploaded S3 URL

      // Show success notification and redirect
      toast.success("Campaign created successfully!", { autoClose: 2000 });
      router.push("/?source=create_campaign");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false); // End submission loading state
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header: Navigation and Logo */}
        <header className="mb-8 flex items-center w-full">
          {/* Left: Back to Campaigns Link */}
          <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>

          {/* Spacer to push the logo to the right */}
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

        {/* Main Content: Create Campaign Form */}
        <main>
          <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>

          {/* Campaign Form Component */}
          <CampaignForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </main>
      </div>
    </div>
  );
}
