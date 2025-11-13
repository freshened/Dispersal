import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, CheckCircle2, Gauge, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Website Performance Optimization | Dispersal Digital Agency",
  description:
    "Blazing-fast load times and smooth interactions that keep visitors engaged. We optimize your website's performance for speed, user experience, and search rankings.",
  keywords:
    "website performance, page speed optimization, site speed, performance optimization, Core Web Vitals, website optimization, Cincinnati web optimization",
  alternates: {
    canonical: "https://dispersal.net/services/performance-optimization",
  },
  openGraph: {
    title: "Website Performance Optimization | Dispersal Digital Agency",
    description:
      "Blazing-fast load times and smooth interactions that keep visitors engaged. We optimize your website's performance for speed and user experience.",
    type: "website",
  },
}

export default function PerformanceOptimizationPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <Navigation />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <Rocket className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Performance Optimization</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Lightning-Fast Websites
            <br />
            <span className="text-white/60">That Convert</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Speed matters. We optimize your website for blazing-fast load times and smooth interactions that keep
            visitors engaged and improve your search rankings.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Performance Optimization Matters
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                Website speed directly impacts user experience, conversion rates, and search engine rankings. A slow
                website can cost you customers and revenue. We optimize every aspect of your site to ensure it loads
                quickly and performs smoothly.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Our performance optimization services cover everything from code optimization to image compression,
                caching strategies, and server configuration.
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
                    <Gauge className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Speed Optimization</h3>
                    <p className="text-white/60">
                      Reduce load times with code minification, image optimization, and efficient asset delivery
                      strategies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Core Web Vitals</h3>
                    <p className="text-white/60">
                      Optimize for Google's Core Web Vitals to improve user experience and search rankings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Mobile Performance</h3>
                    <p className="text-white/60">
                      Ensure your site performs excellently on mobile devices where most users browse the web.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Our Optimization Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Page speed analysis and optimization",
                "Image and asset compression",
                "Code minification and bundling",
                "Caching strategy implementation",
                "CDN setup and configuration",
                "Database query optimization",
                "Server response time improvement",
                "Ongoing performance monitoring",
              ].map((feature, index) => (
                <div key={index} className="glass-dark rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Speed Up Your Site?</h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Let's analyze your website and implement optimizations that will improve speed, user experience, and
              search rankings.
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

