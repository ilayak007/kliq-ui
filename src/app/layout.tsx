import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { MainLayout } from "@/components/layout/main-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Campaign Dashboard",
  description: "Campaign management interface for creators",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}

