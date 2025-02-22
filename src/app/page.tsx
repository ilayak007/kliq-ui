"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import axios from "axios"
import { Loader2, ChevronDown } from "lucide-react"
import Image from "next/image"

interface Campaign {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  assignedBy: string
  assignedImageUrl: string
  launchDate: string
}

const handleCreateNewCampaign = () => {
  window.location.href = "/campaigns/create"
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showActive, setShowActive] = useState(true)
  const [selectedAssignedBy, setSelectedAssignedBy] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL
        const response = await axios.get(`${apiUrl}/campaigns`)
        setCampaigns(response.data)
      } catch (err) {
        setError("Failed to load campaigns")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Check URL query parameters for ?source=create_campaign
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('source') === 'create_campaign') {
      setShowActive(false) // Set the toggle to Draft mode
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin h-10 w-10 text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>
  }

  const filteredCampaigns = selectedAssignedBy
    ? campaigns.filter((c) => c.assignedBy === selectedAssignedBy)
    : showActive
    ? campaigns.filter((c) => c.isActive)
    : campaigns.filter((c) => !c.isActive)

  const assignedUsers = Array.from(new Set(campaigns.map((c) => c.assignedBy))).sort()

  const handleImageClick = () => {
    window.location.reload()
  }
  

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        {/* Title */}
        <h1 className="text-4xl font-bold">Kliq Campaign Dashboard</h1>

        {/* Logo */}
           <a href="" onClick={handleImageClick} className="image-link">
            <Image
              src="https://cdn.prod.website-files.com/66ab3fc8f9140f3bdf6a36a5/66ab3fc8f9140f3bdf6a36fd_kliq-logo.svg"
              alt="Kliq Logo"
              width={100}
              height={25}
              className="hover:scale-110 transition-transform duration-300"
            />
          </a>
      </div>

      {/* Top Bar: Toggle + AssignedBy Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={handleCreateNewCampaign}
            className={`ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition`}
          >
            Create New Campaign
          </button>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-gray-800 p-1 rounded-full">
          <button
            onClick={() => setShowActive(true)}
            disabled={selectedAssignedBy !== null}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
              showActive ? "bg-emerald-500 text-black" : "text-gray-400"
            } ${selectedAssignedBy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Active
          </button>
          <button
            onClick={() => setShowActive(false)}
            disabled={selectedAssignedBy !== null}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
              !showActive ? "bg-yellow-500 text-black" : "text-gray-400"
            } ${selectedAssignedBy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Draft
          </button>
        </div>

        {/* Assigned By Dropdown */}
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center px-4 py-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
          >
            <span>{selectedAssignedBy || "Created By"}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-lg overflow-hidden z-50 border border-gray-600">
              <ul className="max-h-60 overflow-auto">
                <li
                  onClick={() => {
                    setSelectedAssignedBy(null)
                    setDropdownOpen(false)
                  }}
                  className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-600 flex justify-between items-center"
                >
                  <span>All</span>
                </li>
                {assignedUsers.map((user) => (
                  <li
                    key={user}
                    onClick={() => {
                      setSelectedAssignedBy(user)
                      setDropdownOpen(false)
                    }}
                    className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-gray-600 flex justify-between items-center"
                  >
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="text-gray-400 text-center">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.isActive ? "bg-emerald-900/50 text-emerald-400" : "bg-yellow-900/50 text-yellow-400"
                    }`}
                  >
                    {campaign.assignedBy}
                  </span>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.isActive ? "bg-white/600 text-black-00" : "bg-white/600 text-black-00"
                    }`}
                  >
                    {campaign.launchDate}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
