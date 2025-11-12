import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Policy | Dispersal Digital Agency",
  description: "Privacy Policy for Dispersal Digital Agency. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://dispersal.net/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              <h2 className="text-3xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-white/70 leading-relaxed">
                Dispersal Digital Agency ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                We may collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company information</li>
                <li>Project details and requirements</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and communicate with you</li>
                <li>Send you updates and marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-white/70 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
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

