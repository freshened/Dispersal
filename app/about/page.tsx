import type { Metadata } from "next"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "About Andrew Tufarella | Dispersal Digital Agency",
  description:
    "Senior Software Developer at DHL Express with deep expertise in enterprise automation, AI, and applied data systems. Learn about my professional work and independent projects.",
  keywords:
    "Andrew Tufarella, software developer, DHL Express, AI development, enterprise automation, full-stack developer, Cincinnati developer",
  alternates: {
    canonical: "https://dispersal.net/about",
  },
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
      <div className="relative">
        <Navigation />
      </div>
      <About />
      <Footer />
    </main>
  )
}

