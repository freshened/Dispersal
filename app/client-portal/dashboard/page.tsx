"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { FileText, DollarSign, Calendar, Settings, LogOut, User, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Client Dashboard</h1>
          {loading ? (
            <p className="text-lg text-white/80">Loading...</p>
          ) : user ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg text-white/80">
                Welcome, <span className="font-semibold text-white">{user.name || user.email}</span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-white/80">Manage your projects and account</p>
          )}
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Projects</h3>
                  <p className="text-white/60 text-sm">View your active projects</p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Invoices</h3>
                  <p className="text-white/60 text-sm">View and pay invoices</p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Schedule</h3>
                  <p className="text-white/60 text-sm">View upcoming meetings</p>
                </div>
              </div>
            </Card>

            <Link href="/client-portal/analytics/reddit">
              <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Reddit Ads</h3>
                    <p className="text-white/60 text-sm">View Reddit advertising analytics</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/client-portal/integrations/reddit">
              <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer border-dashed">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Add Integration</h3>
                    <p className="text-white/60 text-sm">Connect Reddit Ads account</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="glass-dark rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {user ? `Welcome back, ${user.name || user.email}` : "Welcome to your dashboard"}
                  </p>
                  <p className="text-white/60 text-sm">
                    {user ? `Signed in as ${user.email}` : "Your account is set up and ready to use"}
                  </p>
                </div>
                <span className="text-white/40 text-sm">Just now</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <form action="/api/auth/logout" method="POST">
              <Button
                type="submit"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

