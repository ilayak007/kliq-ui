"use client";

import { ProfileMessageForm } from "@/components/profile-message/profile-message-form";
import { toast } from 'react-toastify'
import axios, { AxiosError } from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const handleUpdateMessage = async (message: string) => {
    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        toast.error("Customer ID not found. Please login again.");
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_KLIQ_BACKEND_API_URL;
      //const apiUrl = "http://localhost:3000"
      const response = await axios.put(`${apiUrl}/api/update-customers`, {
        customerId: Number(customerId),
        profileMessage: message,
      });

      if (response.status === 200) {
        toast.success("Profile message updated successfully!");
      } else {
        toast.error("Failed to update profile message.");
      }
    } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>
    const errorMessage = err.response?.data?.message || 'Something went wrong'
    //setApiError(errorMessage)
    toast.error(errorMessage)
      
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8">
    {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <ProfileMessageForm
            onSubmit={handleUpdateMessage}
          />
        </div>
      </div>
    </div>
  );
}
