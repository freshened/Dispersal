import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, CheckCircle2, TrendingUp, Target, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Analytics & Insights | Dispersal Digital Agency",
  description:
    "Track your success with detailed analytics and actionable insights for growth. We help you understand your data and make informed decisions that drive results.",
  keywords:
    "web analytics, business analytics, data insights, Google Analytics, conversion tracking, business intelligence, Cincinnati analytics",
  openGraph: {
    title: "Analytics & Insights | Dispersal Digital Agency",
    description:
      "Track your success with detailed analytics and actionable insights for growth. We help you understand your data and make informed decisions.",
    type: "website",
  },
}

export default function AnalyticsInsightsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <nav className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
        <div className="glass-dark rounded-full px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo-Only-Dispersal.png"
              alt="Dispersal Digital Agency"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-white font-semibold text-lg">Dispersal Digital Agency</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/#process" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Process
            </Link>
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90" asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <BarChart className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Analytics & Insights</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Data-Driven Decisions
            <br />
            <span className="text-white/60">That Drive Growth</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Understand your audience, track your performance, and make informed decisions with comprehensive analytics
            and actionable insights.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Turn Data Into Actionable Insights
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                Data is only valuable if you can understand it and act on it. We set up comprehensive analytics tracking
                and provide regular reports with actionable insights that help you make informed decisions about your
                digital presence.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                From website traffic analysis to conversion tracking and customer behavior insights, we help you
                understand what's working and what needs improvement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 text-base font-semibold"
                  asChild
                >
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Link href="/#services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 h-12 text-base font-semibold glass-dark bg-transparent"
                  >
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="glass-dark rounded-3xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Website Analytics</h3>
                    <p className="text-white/60">
                      Comprehensive tracking of visitor behavior, traffic sources, and user engagement metrics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Conversion Tracking</h3>
                    <p className="text-white/60">
                      Track goals, conversions, and ROI to understand which strategies are driving real business
                      results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Performance Reports</h3>
                    <p className="text-white/60">
                      Regular reports with clear insights and recommendations to help you optimize your digital
                      strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              What We Track & Analyze
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Website traffic and visitor behavior",
                "Conversion rates and goal tracking",
                "Traffic sources and acquisition channels",
                "User engagement metrics",
                "E-commerce performance",
                "Campaign performance analysis",
                "Customer journey mapping",
                "Custom dashboard creation",
              ].map((feature, index) => (
                <div key={index} className="glass-dark rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Understand Your Data?</h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Let's set up comprehensive analytics tracking and start making data-driven decisions that grow your
              business.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
              asChild
            >
              <Link href="/contact">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

