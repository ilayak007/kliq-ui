// components/predict/SuccessModal.tsx
import Image from "next/image"

interface SuccessModalProps {
  clubName: string
  onClose: () => void
}
const s3BaseUrl = "https://kliq-demo-images.s3.eu-north-1.amazonaws.com/"
//const teamAImageUrl = `${s3BaseUrl}${match.teamA}.jpg`;

export const SuccessModal = ({ clubName, onClose }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-600">Successfully Submitted</h2>
        <div className="flex justify-center mb-4">
          {/* <Image src={`${s3BaseUrl}${clubName}.jpg`} alt={`${clubName} flag`} width={100} height={100} className="rounded-full" /> */}
          <Image 
              src={`${s3BaseUrl}${clubName}.jpg`} 
              alt={`${clubName} flag`} 
              width={120} 
              height={80} 
              className="rounded-xl object-cover"
            />

        </div>
        <p className="text-lg font-medium mb-6">Congrats !!! You have successfully submitted for <span className="font-bold">{clubName}</span> club.</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
