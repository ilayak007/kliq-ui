/**
 * @file CamapaignForm.tsx
 * @description This component has the form elements to create a new campaign. 
 * 
 * @author [Ilayaraja Kasirajan]
 * @created [20-Feb-2025]
 * @lastModified [23-Feb-2025]
 */

"use client"

import type React from "react"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { InstagramIcon, SnapchatIcon, TikTokIcon, YouTubeIcon } from "./icons"

// Props for CampaignForm component
interface CampaignFormProps {
  onSubmit: (formData: FormData) => void // Callback for form submission
  isSubmitting: boolean // Indicates if form is in the submitting state
}

// Interface for form validation errors
interface FormErrors {
  name?: string
  description?: string
  budget?: string
  launchDate?: string
  channels?: string
  image?: string
}

// CampaignForm component for creating a new campaign
export function CampaignForm({ onSubmit, isSubmitting }: CampaignFormProps) {
  const [launchDate, setLaunchDate] = useState<Date>() // Stores selected launch date
  const [budget, setBudget] = useState([5000]) // Stores selected budget (default 5000)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false) // Toggles calendar popover
  const [errors, setErrors] = useState<FormErrors>({}) // Stores form validation errors
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]) // Tracks selected social channels

  // Validates the form fields and sets errors if any
  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {}

    // Validate Campaign Name
    const name = formData.get("name") as string
    if (!name || name.trim() === "") {
      newErrors.name = "Campaign name is required"
    }

    // Validate Description
    const description = formData.get("description") as string
    if (!description || description.trim() === "") {
      newErrors.description = "Campaign description is required"
    }

    // Validate Budget
    if (budget[0] < 5000) {
      newErrors.budget = "Budget must be at least 5000 SAR"
    }

    // Validate Launch Date
    if (!launchDate) {
      newErrors.launchDate = "Launch date is required"
    } else if (launchDate <= new Date()) {
      newErrors.launchDate = "Launch date must be in the future"
    }

    // Validate Selected Channels
    if (selectedChannels.length === 0) {
      newErrors.channels = "At least one channel must be selected"
    }

    // Validate Campaign Image
    const image = formData.get("image") as File
    if (!image || image.name === "") {
      newErrors.image = "Campaign image is required"
    } else if (!image.name.toLowerCase().endsWith(".jpg")) {
      newErrors.image = "Only JPG images are supported"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handles form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("budget", budget[0].toString())
    formData.append("launchDate", launchDate ? launchDate.toISOString() : "")

    if (validateForm(formData)) {
      onSubmit(formData)
    }
  }

  // Handles date selection from the calendar
  const handleDateSelect = (date: Date | undefined) => {
    setLaunchDate(date)
    setIsCalendarOpen(false)
    setErrors((prev) => ({ ...prev, launchDate: undefined }))
  }

  // Handles channel selection/deselection
  const handleChannelChange = (channel: string, checked: boolean) => {
    setSelectedChannels((prev) => {
      const newChannels = checked ? [...prev, channel] : prev.filter((ch) => ch !== channel)

      setErrors((prev) => ({
        ...prev,
        channels: newChannels.length === 0 ? "At least one channel must be selected" : undefined,
      }))

      return newChannels
    })
  }

  // Renders error message for form fields
  const ErrorMessage = ({ message }: { message?: string }) =>
    message ? <span className="text-red-500 text-sm mt-1">{message}</span> : null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Campaign Name Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="name">Campaign Name</Label>
          <ErrorMessage message={errors.name} />
        </div>
        <Input
          id="name"
          name="name"
          className={cn(
            "bg-zinc-900 border-zinc-700 text-white",
            errors.name && "border-red-500 focus-visible:ring-red-500",
          )}
          onChange={() => setErrors((prev) => ({ ...prev, name: undefined }))}
        />
      </div>

      {/* Campaign Description Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Campaign Description</Label>
          <ErrorMessage message={errors.description} />
        </div>
        <Textarea
          id="description"
          name="description"
          className={cn(
            "bg-zinc-900 border-zinc-700 text-white min-h-[100px]",
            errors.description && "border-red-500 focus-visible:ring-red-500",
          )}
          onChange={() => setErrors((prev) => ({ ...prev, description: undefined }))}
        />
      </div>

      {/* Budget Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Assigned Budget</Label>
          <ErrorMessage message={errors.budget} />
        </div>
        <div className="flex items-center space-x-4">
          <Slider
            value={budget}
            onValueChange={(value) => {
              setBudget(value)
              setErrors((prev) => ({ ...prev, budget: undefined }))
            }}
            max={100000}
            min={0}
            step={100}
            className={cn("flex-grow", errors.budget && "[&_.bg-primary]:bg-red-500")}
          />
          <span className="text-lg font-semibold">SAR {budget[0].toLocaleString()}</span>
        </div>
      </div>

      {/* Launch Date Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Launch Date</Label>
          <ErrorMessage message={errors.launchDate} />
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-white",
                !launchDate && "text-muted-foreground",
                errors.launchDate && "border-red-500 focus-visible:ring-red-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {launchDate ? format(launchDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg">
              <Calendar
                mode="single"
                selected={launchDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(date) => date < new Date()}
                className="rounded-2xl"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Channel Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Assigned Channels</Label>
          <ErrorMessage message={errors.channels} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "YouTube", icon: <YouTubeIcon /> },
            { name: "Snapchat", icon: <SnapchatIcon /> },
            { name: "TikTok", icon: <TikTokIcon /> },
            { name: "Instagram", icon: <InstagramIcon /> },
          ].map((channel) => (
            <div key={channel.name} className="flex items-center space-x-2">
              <Checkbox
                id={channel.name}
                name="channels"
                value={channel.name}
                className={cn("border-white", errors.channels && "border-red-500")}
                onCheckedChange={(checked) => handleChannelChange(channel.name, checked as boolean)}
              />
              <Label htmlFor={channel.name} className="flex items-center space-x-2">
                {channel.icon}
                <span>{channel.name}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="image">Campaign Image</Label>
          <ErrorMessage message={errors.image} />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById("image")?.click()}
            className={cn(
              "bg-zinc-800 hover:bg-zinc-700 text-white",
              errors.image && "border-red-500 focus-visible:ring-red-500",
            )}
          >
            Browse
          </Button>
          <span className="text-sm text-gray-400" id="file-name">
            No file selected (Only jpg format allowed)
          </span>
        </div>
        <Input
          id="image"
          name="image"
          type="file"
          accept=".jpg"
          className="hidden"
          onChange={(e) => {
            const fileName = e.target.files?.[0]?.name || "No file selected"
            document.getElementById("file-name")!.textContent = fileName
            setErrors((prev) => ({ ...prev, image: undefined }))
          }}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700">
        {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
      </Button>
    </form>
  )
}
