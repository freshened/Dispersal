"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowRight, Lock, Mail, CheckCircle2, Info } from "lucide-react"

export default function ClientPortalPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code" | "success">("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          router.push("/client-portal/dashboard")
        }
      })
      .catch(() => {})
  }, [router])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code")
      }

      setStep("code")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid code")
      }

      setStep("success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <Lock className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Client Portal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Sign In to Your
            <br />
            <span className="text-white/60">Client Portal</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Access your projects, invoices, and account information.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-md mx-auto px-4">
          <div className="glass-dark rounded-3xl p-8 lg:p-12">
            {step === "success" ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Success!</h3>
                <p className="text-white/60 mb-6">
                  Your code has been verified. You're now signed in!
                </p>
                <Button
                  size="lg"
                  className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                  asChild
                >
                  <Link href="/client-portal/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : step === "code" ? (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-white/80 text-sm mb-2">We sent a code to</p>
                  <p className="text-white font-semibold">{email}</p>
                </div>

                <div>
                  <Label htmlFor="code" className="text-white mb-2 block">
                    Enter Code
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pl-10 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">Enter the 6-digit code from your email</p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || code.length !== 6}
                  className="w-full rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                >
                  {isSubmitting ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("email")
                    setCode("")
                    setError("")
                  }}
                  className="w-full text-white/60 hover:text-white"
                >
                  Use a different email
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pl-10"
                      placeholder="your@email.com"
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">We'll send you a code to sign in</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                  <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-400 text-xs font-medium mb-1">Access Information</p>
                    <p className="text-blue-300/80 text-xs">
                      Login codes are only sent to registered email addresses. If your email is not in our system, you will not receive a code. Please contact us if you need access.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                >
                  {isSubmitting ? (
                    "Sending code..."
                  ) : (
                    <>
                      Send Code
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {step === "email" && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm text-center">
                  Don't have an account?{" "}
                  <Link href="/contact" className="text-white hover:text-white/80 transition-colors underline">
                    Contact us
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

