"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileMessageFormProps {
  initialMessage?: string
  onSubmit?: (message: string) => Promise<void>
}



export function ProfileMessageForm({ initialMessage = "", onSubmit }: ProfileMessageFormProps) {
  const [message, setMessage] = useState(initialMessage)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleCancel = () => {
    router.back() // This will take the user back to the previous page
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError("")
    setSuccess(false)

    // Validate
    if (!message.trim()) {
      setError("Please enter a message")
      return
    }

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(message)
      }
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to update profile message. Please try again."+err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 max-w-md">
      <h2 className="text-xl font-bold mb-4">Profile Message</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* <Label htmlFor="profile-message">Your Message</Label> */}
          <Input
            id="profile-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your profile message"
            className="w-full border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            maxLength={25}
          />

          <div className="flex items-start mt-1">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">This message will be publicly visible to everyone in rankings page</p>
          </div>

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

          {success && <p className="text-sm text-green-500 mt-1">Profile message updated successfully!</p>}
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="bg-purple-200 hover:bg-purple-300 text-black" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Change Profile Message"}
          </Button>

          <Button
          className="bg-gray-300 hover:bg-gray-400 text-black"
          onClick={handleCancel}
        >
          Cancel
        </Button>

        </div>
      </form>
    </div>
  )
}

