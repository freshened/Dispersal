import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, Target, CheckCircle2, TrendingUp, Users, Megaphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Search, Display & Social Media Advertising | Dispersal Digital Agency",
  description:
    "Maximize your reach with targeted search ads, eye-catching display campaigns, and engaging social media advertising. Drive conversions and grow your business with data-driven ad strategies.",
  keywords:
    "digital advertising, search ads, display advertising, social media ads, Google Ads, Facebook Ads, paid advertising, Cincinnati digital marketing",
  alternates: {
    canonical: "https://dispersal.net/services/digital-advertising",
  },
  openGraph: {
    title: "Search, Display & Social Media Advertising | Dispersal Digital Agency",
    description:
      "Maximize your reach with targeted search ads, eye-catching display campaigns, and engaging social media advertising.",
    type: "website",
  },
}

export default function DigitalAdvertisingPage() {
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
            <Target className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Digital Advertising</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Targeted Ads That
            <br />
            <span className="text-white/60">Drive Results</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Search, display, and social media advertising campaigns that reach the right audience at the right time and
            convert them into customers.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Comprehensive Digital Advertising Solutions
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                In today's competitive digital landscape, effective advertising is essential for growth. We create and
                manage multi-channel advertising campaigns that maximize your reach and drive measurable results.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                From search engine ads that capture high-intent customers to display campaigns that build brand awareness
                and social media ads that engage your target audience, we've got you covered.
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
                    <Target className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Search Advertising</h3>
                    <p className="text-white/60">
                      Google Ads and Bing Ads campaigns that target customers actively searching for your products or
                      services.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Megaphone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Display Advertising</h3>
                    <p className="text-white/60">
                      Eye-catching banner ads and visual campaigns that build brand awareness across the web.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Social Media Advertising</h3>
                    <p className="text-white/60">
                      Facebook, Instagram, LinkedIn, and other platform ads that engage your target audience where they
                      spend their time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Our Advertising Approach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Data-driven campaign strategy and optimization",
                "Keyword research and audience targeting",
                "A/B testing for maximum performance",
                "Real-time campaign monitoring and adjustments",
                "Conversion tracking and ROI analysis",
                "Multi-platform campaign management",
                "Creative design and ad copywriting",
                "Budget optimization for best results",
              ].map((feature, index) => (
                <div key={index} className="glass-dark rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Let's create advertising campaigns that reach the right people and drive real results for your business.
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

