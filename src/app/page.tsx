/**
 * @file Home.tsx
 * @description Campaign Dashboard - Displays a list of campaigns with filtering options (Active/Draft, Assigned By).
 * @author Ilayaraja Kasirajan
 * @created [20-Feb-2025]
 * @LastModified [23-Feb-2025]
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { Loader2, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  assignedBy: string;
  assignedImageUrl: string;
  launchDate: string;
}

/**
 * Redirects the user to the campaign creation page.
 */
const handleCreateNewCampaign = () => {
  window.location.href = "/campaigns/create";
};

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(true);
  const [selectedAssignedBy, setSelectedAssignedBy] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Fetch campaigns from the backend on component mount.
   */
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
        const response = await axios.get(`${apiUrl}/campaigns`);
        setCampaigns(response.data);
      } catch (err) {
        setError("Failed to load campaigns");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  /**
   * Check for URL query parameters to set default view (e.g., open Drafts after campaign creation).
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("source") === "create_campaign") {
      setShowActive(false); // Switch to Draft view after creating a campaign.
    }
  }, []);

  /**
   * Handle clicks outside the dropdown to close it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin h-10 w-10 text-gray-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  /**
   * Filter campaigns based on active/draft status and selected "Assigned By" user.
   */
  const filteredCampaigns = selectedAssignedBy
    ? campaigns.filter((c) => c.assignedBy === selectedAssignedBy)
    : showActive
    ? campaigns.filter((c) => c.isActive)
    : campaigns.filter((c) => !c.isActive);

  const assignedUsers = Array.from(new Set(campaigns.map((c) => c.assignedBy))).sort();

  /**
   * Handle logo click to reload the page.
   */
  const handleImageClick = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold">Kliq Campaign Dashboard</h1>
  
        {/* Kliq Logo with reload on click */}
        <a href="" onClick={handleImageClick}>
          <Image
            src="https://cdn.prod.website-files.com/66ab3fc8f9140f3bdf6a36a5/66ab3fc8f9140f3bdf6a36fd_kliq-logo.svg"
            alt="Kliq Logo"
            width={80}
            height={20}
            className="hover:scale-110 transition-transform duration-300"
          />
        </a>
      </div>
  
      {/* Top Bar with Create Button, Toggle, and Dropdown */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
        {/* Create Campaign Button */}
        <button
          onClick={handleCreateNewCampaign}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Create New Campaign
        </button>
  
        {/* Active/Draft Toggle */}
        <div className="flex w-full md:w-auto bg-gray-800 p-1 rounded-full">
          <button
            onClick={() => setShowActive(true)}
            disabled={selectedAssignedBy !== null}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-semibold rounded-full transition-all ${
              showActive ? "bg-emerald-500 text-black" : "text-gray-400"
            } ${selectedAssignedBy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Active
          </button>
          <button
            onClick={() => setShowActive(false)}
            disabled={selectedAssignedBy !== null}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-semibold rounded-full transition-all ${
              !showActive ? "bg-yellow-500 text-black" : "text-gray-400"
            } ${selectedAssignedBy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Draft
          </button>
        </div>
  
        {/* Assigned By Dropdown */}
 {/* Assigned By Dropdown */}
<div className="relative z-50 ml-auto" ref={dropdownRef}>
  <button
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
  >
    <span>{selectedAssignedBy || "Created By"}</span>
    <ChevronDown className="ml-2 h-4 w-4" />
  </button>

  {dropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-lg overflow-hidden border border-gray-600 z-50">
      <ul className="max-h-60 overflow-auto">
        {/* Option to reset filter */}
        <li
          onClick={() => {
            setSelectedAssignedBy(null);
            setDropdownOpen(false);
          }}
          className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-600"
        >
          <span>All</span>
        </li>
        {/* List of unique assigned users */}
        {assignedUsers.map((user) => (
          <li
            key={user}
            onClick={() => {
              setSelectedAssignedBy(user);
              setDropdownOpen(false);
            }}
            className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-600"
          >
            <span>{user}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>



      </div>
  
      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <p className="text-gray-400 text-center">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="group block">
              <div className="bg-gray-900 p-4 rounded-lg transition-all group-hover:scale-105 relative">
                <Image
                  src={campaign.imageUrl || "/placeholder.svg"}
                  alt={campaign.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="mt-3 text-lg font-semibold">{campaign.name}</h3>
                <p className="text-sm text-gray-400">{campaign.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.isActive ? "bg-emerald-900/50 text-emerald-400" : "bg-yellow-900/50 text-yellow-400"
                    }`}
                  >
                    {campaign.assignedBy}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white/600 text-black">
                    {campaign.launchDate}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
  
}
