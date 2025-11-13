import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Server, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Web Design & Hosting Services | Dispersal Digital Agency",
  description:
    "Professional web design and premium hosting services. We create stunning, custom websites with 99.9% uptime hosting that captivate your audience and convert visitors into customers.",
  keywords: "web design, website design, custom websites, premium hosting, web development, Cincinnati web design",
  alternates: {
    canonical: "https://dispersal.net/services/web-design",
  },
  openGraph: {
    title: "Web Design & Hosting Services | Dispersal Digital Agency",
    description:
      "Professional web design and premium hosting services. We create stunning, custom websites with 99.9% uptime hosting.",
    type: "website",
  },
}

export default function WebDesignPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <Navigation />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <Palette className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Web Design & Hosting</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Stunning Websites That
            <br />
            <span className="text-white/60">Convert Visitors</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Custom-designed websites paired with premium hosting. We create beautiful, fast, and secure sites that drive
            results.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Custom Web Design That Reflects Your Brand
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                Your website is often the first impression customers have of your business. We design custom websites
                that not only look stunning but also effectively communicate your brand message and convert visitors
                into customers.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Every website we create is built with your unique business goals in mind, ensuring it performs exactly
                as you need it to.
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
                    <Palette className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Custom Design</h3>
                    <p className="text-white/60">
                      Unique designs tailored to your brand identity and business objectives. No templates, no
                      compromises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Server className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Premium Hosting Included</h3>
                    <p className="text-white/60">
                      Lightning-fast, secure hosting with 99.9% uptime guarantee. We handle all technical details so
                      you don't have to.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              What's Included in Our Web Design Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Responsive design that works on all devices",
                "Custom branding and visual identity",
                "Premium hosting with 99.9% uptime",
                "SSL certificates and security",
                "Content management system",
                "SEO-friendly structure",
                "Fast loading times",
                "Ongoing support and maintenance",
              ].map((feature, index) => (
                <div key={index} className="glass-dark rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Let's create a website that truly represents your business and drives real results.
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

