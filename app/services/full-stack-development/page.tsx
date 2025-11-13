import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, CheckCircle2, Code, Database, Zap } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Full-Stack Web Development | Dispersal Digital Agency",
  description:
    "Complete full-stack web development services. From simple sites to complex web applications, we build exactly what you need with modern technologies and best practices.",
  keywords:
    "full-stack development, web development, web applications, custom software, API development, database design, Cincinnati web developers",
  alternates: {
    canonical: "https://dispersal.net/services/full-stack-development",
  },
  openGraph: {
    title: "Full-Stack Web Development | Dispersal Digital Agency",
    description:
      "Complete full-stack web development services. From simple sites to complex web applications, we build exactly what you need.",
    type: "website",
  },
}

export default function FullStackDevelopmentPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <Navigation />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <Globe className="h-4 w-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Full-Stack Development</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Complete Web Solutions
            <br />
            <span className="text-white/60">Built to Scale</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            From simple websites to complex web applications, we build full-stack solutions that grow with your
            business.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                End-to-End Web Development
              </h2>
              <p className="text-lg text-white/60 mb-6 leading-relaxed">
                Whether you need a simple business website or a complex web application, our full-stack development team
                has the expertise to build exactly what you need. We handle everything from frontend design to backend
                infrastructure.
              </p>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Using modern technologies and best practices, we create scalable solutions that perform well and are easy
                to maintain.
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
                    <Code className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Frontend Development</h3>
                    <p className="text-white/60">
                      Modern, responsive user interfaces built with the latest frameworks and technologies for optimal
                      user experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Backend Development</h3>
                    <p className="text-white/60">
                      Robust server-side architecture, APIs, and database design that power your application securely
                      and efficiently.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Integration & APIs</h3>
                    <p className="text-white/60">
                      Seamless integration with third-party services, payment processors, and other tools your business
                      relies on.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              What We Build
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Custom web applications",
                "E-commerce platforms",
                "Content management systems",
                "API development and integration",
                "Database design and optimization",
                "Cloud-based solutions",
                "Progressive web apps",
                "Real-time applications",
              ].map((feature, index) => (
                <div key={index} className="glass-dark rounded-2xl p-6 flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Build Your Application?</h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create a custom solution that meets your exact needs.
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

