import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import dynamic from "next/dynamic"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import "./globals.css"

// Only load Analytics if Vercel Analytics is enabled
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((mod) => mod.Analytics),
  { ssr: false }
)

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Dispersal Digital Agency | Website Design, Hosting & SEO",
  description:
    "Premier digital marketing agency. We create stunning websites, provide reliable hosting, and deliver results-driven SEO for businesses.",
  generator: "v0.app",
  alternates: {
    canonical: "https://dispersal.net",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  )
}
