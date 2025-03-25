'use client'

import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

export default function ChangePasswordForm() {
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const router = useRouter()

  const validate = () => {
    if (!email) {
      setApiError('Email is required')
      return false
    }
    if (!oldPassword) {
      setApiError('Old Password is required')
      return false
    }
    if (!newPassword) {
      setApiError('New Password is required')
      return false
    }
    setApiError('')
    return true
  }

  const handleChangePassword = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      const response = await axios.post(`${apiUrl}/api/customer/change-password`, {
        email,
        oldPassword,
        newPassword,
      })

      if (response.status === 200) {
        toast.success(response.data.message || 'Password updated successfully!')
        setEmail('')
        setOldPassword('')
        setNewPassword('')
        setApiError('')

        // ✅ Redirect after a short delay to show toast
        setTimeout(() => {
          router.push('/predict')
        }, 1500)
      } else {
        setApiError(response.data.message || 'Failed to update password')
        toast.error(response.data.message || 'Failed to update password')
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      const errorMessage = err.response?.data?.message || 'Something went wrong'
      setApiError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.back() // This will take the user back to the previous page
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
      </div>

      {apiError && <p className="text-red-600 mb-4">{apiError}</p>}

      <div className="flex space-x-4">
        <Button
          className="bg-orange-300 hover:bg-orange-400 text-black"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Change Password'}
        </Button>

        <Button
          className="bg-gray-300 hover:bg-gray-400 text-black"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
