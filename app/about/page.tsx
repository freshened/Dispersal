import type { Metadata } from "next"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Andrew Tufarella | Dispersal Digital Agency",
  description:
    "Senior Software Developer at DHL Express with deep expertise in enterprise automation, AI, and applied data systems. Learn about my professional work and independent projects.",
  keywords:
    "Andrew Tufarella, software developer, DHL Express, AI development, enterprise automation, full-stack developer, Cincinnati developer",
  openGraph: {
    title: "About Andrew Tufarella | Dispersal Digital Agency",
    description:
      "Senior Software Developer at DHL Express with deep expertise in enterprise automation, AI, and applied data systems.",
    type: "website",
  },
}

export default function AboutPage() {
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
      <About />
      <Footer />
    </main>
  )
}

