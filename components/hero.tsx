"use client"

import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-start justify-center pt-24 md:pt-32 pb-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/GreatAmerican.mp4" type="video/mp4" />
          {/* Fallback placeholder */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black" />
        </video>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Vignette effect - darker in center where text is */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.4)_70%)]" />
      </div>

      <Navigation />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 md:pt-28">
        <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-10 md:mb-14">
          <span className="text-white/90 text-sm font-medium">Cincinnati's Most Creative Digital Agency</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-[1.1] text-balance">
          More Calls. More Leads. More Revenue.
        </h1>

        <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-light text-pretty drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          We build high performance website and marketing systems that actually <span className="font-the-bold italic">Convert</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
            asChild
          >
            <a href="/contact">Start Your Project</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 h-14 text-base font-semibold glass-dark bg-transparent"
            asChild
          >
            <a href="/about">About</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-dark rounded-full p-3 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
