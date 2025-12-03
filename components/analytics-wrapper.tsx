"use client"

import dynamic from "next/dynamic"

// Only load Analytics if Vercel Analytics is enabled
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((mod) => mod.Analytics),
  { ssr: false }
)

export function AnalyticsWrapper() {
  return <Analytics />
}

