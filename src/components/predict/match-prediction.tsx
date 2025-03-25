"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const s3BaseUrl = "https://kliq-demo-images.s3.eu-north-1.amazonaws.com/"

interface MatchProps {
  match: {
    matchId: number
    teamA: string
    teamB: string
    matchStartDateTime: string
    totalVoteCount: number
  }
  onSubmit: (prediction: string) => void
}

export function MatchPrediction({ match, onSubmit }: MatchProps) {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!prediction) return

    setIsSubmitting(true)
    try {
      await onSubmit(prediction)
      setPrediction(null)
    } catch (error) {
      console.error("Error submitting prediction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const teamAImageUrl = `${s3BaseUrl}${match.teamA}.jpg`
  const teamBImageUrl = `${s3BaseUrl}${match.teamB}.jpg`

  return (
    <div className="border border-gray-300 rounded-lg p-4 relative" >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">        

        <RadioGroup 
          value={prediction || ""} 
          onValueChange={setPrediction} 
          className="flex items-center space-x-0 md:space-x-20"
        >
          {/* Team A */}
          <Label className="flex items-center space-x-5 cursor-pointer">
            <RadioGroupItem 
              value={match.teamA} 
              className="border-2 border-black text-black focus:ring-black" 
            />
            <div className="flex flex-col items-center">
              <div className="w-340 h-16 mb-2 overflow-hidden rounded-md">
                <img 
                  src={teamAImageUrl} 
                  alt={`${match.teamA} flag`} 
                  width={96} 
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>                  
              <span className="text-blue-600 font-medium">{match.teamA}</span>
            </div>
          </Label>

          {/* Team B */}
          <Label className="flex items-center space-x-5 cursor-pointer">
            <RadioGroupItem 
              value={match.teamB} 
              className="border-2 border-black text-black focus:ring-black" 
            />
            <div className="flex flex-col items-center">
              <div className="w-340 h-16 mb-2 overflow-hidden rounded-md">
                <img 
                  src={teamBImageUrl} 
                  alt={`${match.teamB} flag`} 
                  width={96} 
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>                
              <span className="text-blue-600 font-medium">{match.teamB}</span>
            </div>
          </Label>
        </RadioGroup>

        {/* Vote Count Text */}
        <div className="absolute md:top-2 md:right-4 bottom-2 left-4 text-green-600 text-sm md:bottom-auto md:left-auto">
          {match.totalVoteCount} voted till now
        </div>
        {/* Submit Button */}
        <Button
          className="bg-orange-300 hover:bg-orange-400 text-black self-end"
          disabled={!prediction || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : `Submit ${prediction || ""}`}
        </Button>
      </div>
    </div>
  )
}
