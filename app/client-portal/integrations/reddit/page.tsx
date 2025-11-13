"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RedditIntegrationPage() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [accountId, setAccountId] = useState("")
  const [showSecret, setShowSecret] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [hasIntegration, setHasIntegration] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for URL parameters
    const params = new URLSearchParams(window.location.search)
    const success = params.get("success")
    const error = params.get("error")

    if (success === "authorized") {
      setSuccess(true)
      setError("")
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname)
      // Refresh integration data to show authorization status
      fetch("/api/integrations/reddit")
        .then((res) => res.json())
        .then((data) => {
          if (data.integration) {
            setIsAuthorized(!!data.integration.refreshToken)
          }
        })
        .catch(() => {})
    } else if (error) {
      setError(decodeURIComponent(error))
      setSuccess(false)
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname)
    }

    fetch("/api/integrations/reddit")
      .then((res) => res.json())
      .then((data) => {
        if (data.integration) {
          setClientId(data.integration.clientId)
          setAccountId(data.integration.accountId || "")
          setHasIntegration(true)
          // Check if authorized (has refresh token)
          setIsAuthorized(!!data.integration.refreshToken)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/integrations/reddit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          accountId: accountId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to save integration")
      }

      setSuccess(true)
      setHasIntegration(true)
      // Don't redirect - let user authorize after saving credentials
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your Reddit integration? This will stop analytics from working.")) {
      return
    }

    try {
      const response = await fetch("/api/integrations/reddit", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove integration")
      }

      setClientId("")
      setClientSecret("")
      setAccountId("")
      setHasIntegration(false)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/60">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Reddit Ads Integration</h1>
          <p className="text-lg text-white/80">Connect your Reddit Ads account to view analytics</p>
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="glass-dark rounded-3xl p-8 lg:p-12">
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">
                  {hasIntegration ? "Integration saved successfully!" : "Integration removed successfully!"}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="clientId" className="text-white mb-2 block">
                  Reddit App ID (Client ID)
                </Label>
                <Input
                  id="clientId"
                  name="clientId"
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="3qh7jio6afyH3sc54XlIMQ"
                />
                <p className="text-white/60 text-xs mt-2">
                  Your Reddit App ID from the Reddit Ads dashboard.
                </p>
                <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <p className="text-white/80 text-xs font-medium mb-2">⚠️ Important: Set this redirect URI in Reddit Developer Portal:</p>
                  <code className="bg-black/30 px-3 py-2 rounded text-xs text-white/90 block break-all">
                    {typeof window !== "undefined" ? `${window.location.origin}/api/auth/reddit/callback` : "http://localhost:3000/api/auth/reddit/callback"}
                  </code>
                  <p className="text-white/50 text-xs mt-2">
                    Copy this exact URL (including http:// or https://) and paste it in the "Redirect URI" field in your Reddit app settings.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="clientSecret" className="text-white mb-2 block">
                  Reddit Secret
                </Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    name="clientSecret"
                    type={showSecret ? "text" : "password"}
                    required={!hasIntegration}
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                    placeholder="Enter your Reddit secret"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-white/60 text-xs mt-2">
                  {hasIntegration ? "Leave blank to keep existing secret, or enter new secret to update" : "Your Reddit App Secret"}
                </p>
              </div>

              <div>
                <Label htmlFor="accountId" className="text-white mb-2 block">
                  Reddit Ads Account ID <span className="text-white/40">(Optional)</span>
                </Label>
                <Input
                  id="accountId"
                  name="accountId"
                  type="text"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Your Reddit Ads account ID"
                />
                <p className="text-white/60 text-xs mt-2">Your Reddit Ads account ID (found in your Reddit Ads dashboard)</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      {hasIntegration ? "Update Integration" : "Save Integration"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {hasIntegration && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </form>

            {hasIntegration && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Authorization Status</h3>
                    {isAuthorized ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <div>
                          <p className="text-green-400 text-sm font-medium">Authorized</p>
                          <p className="text-green-400/60 text-xs mt-1">Your Reddit account is connected and ready to use.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm mb-3">
                          Your credentials are saved, but you need to authorize access to your Reddit account.
                        </p>
                        <Button
                          type="button"
                          onClick={() => {
                            window.location.href = "/api/auth/reddit/authorize"
                          }}
                          className="w-full rounded-full bg-yellow-500 text-black hover:bg-yellow-400 px-8 h-12 text-base font-semibold"
                        >
                          Authorize with Reddit
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <p className="text-white/40 text-xs mt-3 text-center">
                          You'll be redirected to Reddit to grant access to your account
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                <Link href="/client-portal/dashboard" className="text-white hover:text-white/80 transition-colors underline">
                  ← Back to Dashboard
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}

