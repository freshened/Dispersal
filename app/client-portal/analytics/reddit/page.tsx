"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { BarChart3, Eye, MousePointerClick, DollarSign, TrendingUp, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RedditAdsData {
  impressions: number
  clicks: number
  spend: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
}

export default function RedditAdsPage() {
  const [data, setData] = useState<RedditAdsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/analytics/reddit")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data")
      }

      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Reddit Ads Analytics</h1>
          <p className="text-lg text-white/80">Track your Reddit advertising performance</p>
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
            <Button
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm mb-3">{error}</p>
              {error.includes("not configured") && (
                <Link href="/client-portal/integrations/reddit">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Up Integration
                  </Button>
                </Link>
              )}
            </div>
          )}

          {loading && !data ? (
            <div className="text-center py-12">
              <p className="text-white/60">Loading analytics data...</p>
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Impressions</h3>
                  <p className="text-3xl font-bold text-white">{data.impressions.toLocaleString()}</p>
                </Card>

                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <MousePointerClick className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Clicks</h3>
                  <p className="text-3xl font-bold text-white">{data.clicks.toLocaleString()}</p>
                </Card>

                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Spend</h3>
                  <p className="text-3xl font-bold text-white">${data.spend.toFixed(2)}</p>
                </Card>

                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Conversions</h3>
                  <p className="text-3xl font-bold text-white">{data.conversions.toLocaleString()}</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <BarChart3 className="h-8 w-8 text-white/60" />
                    <h3 className="text-white font-semibold">Click-Through Rate</h3>
                  </div>
                  <p className="text-4xl font-bold text-white">{data.ctr}%</p>
                  <p className="text-white/60 text-sm mt-2">Clicks per 100 impressions</p>
                </Card>

                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <DollarSign className="h-8 w-8 text-white/60" />
                    <h3 className="text-white font-semibold">Cost Per Click</h3>
                  </div>
                  <p className="text-4xl font-bold text-white">${data.cpc}</p>
                  <p className="text-white/60 text-sm mt-2">Average cost per click</p>
                </Card>

                <Card className="glass-dark rounded-2xl p-6 border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <Eye className="h-8 w-8 text-white/60" />
                    <h3 className="text-white font-semibold">Cost Per 1000 Impressions</h3>
                  </div>
                  <p className="text-4xl font-bold text-white">${data.cpm}</p>
                  <p className="text-white/60 text-sm mt-2">CPM rate</p>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}
