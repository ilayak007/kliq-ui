"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function WorldCupChallengePage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({})
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    const customerId = localStorage.getItem("customerId")

    if (authToken && customerId) {
      router.push("/predict")
    }
  }, [router])

  const validate = () => {
    const newErrors: typeof errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) newErrors.email = "Email is required"
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({}) // Reset previous errors

    if (!validate()) return

    setLoading(true) // Start spinner
    try {
      const response = await axios.post("http://localhost:3000/api/customer/login", {
        email,
        password,
      })

      const { token, customer } = response.data
      const customerId = customer.customerId
      const customerName = customer.customerName

      localStorage.setItem("authToken", token)
      localStorage.setItem("customerId", customerId.toString())
      localStorage.setItem("customerName", customerName)

      router.push("/predict")
    } catch (err: unknown) {
      console.error("Login failed:", err)
      if (axios.isAxiosError(err)) {
        setErrors({ api: err.response?.data?.message || "Login failed. Please try again." })
      } else {
        setErrors({ api: "Login failed. Please try again." })
      }
    } finally {
      setLoading(false) // Stop spinner
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center px-4 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8B1538]">IPL Challenge !!!</h1>
        <p className="text-gray-800 mt-1">Log in - Predict the winner - Earn points - Win vouchers</p>
      </div>

      {/* Banner */}
      <div className="w-full h-[150px] sm:h-[180px] md:h-[220px] mb-6 flex overflow-hidden rounded-lg">
        <div className="w-[30%] h-full flex">
          <div className="w-1/2 h-full relative">
            <Image src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/kohli.jpg" alt="Kohli" fill className="object-cover" />
          </div>
          <div className="w-1/2 h-full relative">
            <Image src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/rohit.jpg" alt="Rohit" fill className="object-cover" />
          </div>
        </div>

        <div className="w-[40%] h-full bg-[#8B1538] flex items-center justify-center">
          <div className="relative w-[95%] h-full mx-auto">
            <Image
              src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/ipl1.jpg"
              alt="IPL"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>

        <div className="w-[30%] h-full flex">
          <div className="w-1/2 h-full relative">
            <Image src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/dhoni.jpg" alt="Dhoni" fill className="object-cover" />
          </div>
          <div className="w-1/2 h-full relative">
            <Image src="https://kliq-demo-images.s3.eu-north-1.amazonaws.com/cummins.jpg" alt="Cummins" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* How to participate */}
        <div>
          <h2 className="text-l font-low mb-3 text-white bg-[#8B1538] p-2 rounded">How to participate?</h2>
          <ul className="space-y-1.5">
            <li>• Log-in to participate and predict the outcome of each game</li>
            <li>• Predict correctly - earn 50 points</li>
            <li>• Incorrect prediction - lose 20 points</li>
            <li>• Top 3 winners will get Gift Vouchers</li>
            <li>• Participation voucher also there. So why waiting. Let&apos;s Predict 🚀 🚀 🚀</li>
          </ul>
        </div>

        {/* Login */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-3">Login</h2>
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner size={40} text="Logging In.." />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}
                <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#152a62] text-white">Login</Button>
              </div>
            </form>
          )}

          <p className="text-sm text-center mt-3 text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => setShowModal(true)}
              className="text-[#8B1538] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Flags */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {["qa", "br", "ar", "fr", "es"].map((code) => (
            <img key={code} src={`https://flagcdn.com/w80/${code}.png`} className="w-16 h-12 rounded border" alt={`${code} flag`} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {["de", "pt", "nl", "us", "jp"].map((code) => (
            <img key={code} src={`https://flagcdn.com/w80/${code}.png`} className="w-16 h-12 rounded border" alt={`${code} flag`} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Registration</h2>
            <p className="mb-6">Please contact <span className="font-bold">Ilaya</span> for registration.</p>
            <Button
              onClick={() => setShowModal(false)}
              className="bg-[#1E3A8A] text-white w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}    

    </div>
  )
}
