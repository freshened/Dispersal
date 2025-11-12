import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service | Dispersal Digital Agency",
  description: "Terms of Service for Dispersal Digital Agency. Read our terms and conditions for using our website and services.",
  alternates: {
    canonical: "https://dispersal.net/terms-of-service",
  },
}

export default function TermsOfServicePage() {
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
            <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              About
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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Terms of Service
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-dark rounded-3xl p-8 lg:p-12 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Agreement to Terms</h2>
              <p className="text-white/70 leading-relaxed">
                By accessing or using the Dispersal Digital Agency website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Use License</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on Dispersal Digital Agency's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Services</h2>
              <p className="text-white/70 leading-relaxed">
                Dispersal Digital Agency provides web design, development, hosting, and digital marketing services. All services are provided subject to separate service agreements that will be executed between Dispersal Digital Agency and the client.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Disclaimer</h2>
              <p className="text-white/70 leading-relaxed">
                The materials on Dispersal Digital Agency's website are provided on an 'as is' basis. Dispersal Digital Agency makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Limitations</h2>
              <p className="text-white/70 leading-relaxed">
                In no event shall Dispersal Digital Agency or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dispersal Digital Agency's website, even if Dispersal Digital Agency or a Dispersal Digital Agency authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:drew@dispersal.net" className="text-white hover:text-white/80 underline">
                  drew@dispersal.net
                </a>
                {" "}or call us at{" "}
                <a href="tel:5138340809" className="text-white hover:text-white/80 underline">
                  (513) 834-0809
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

