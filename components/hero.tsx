"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/GreatAmerican.mp4" type="video/mp4" />
          {/* Fallback placeholder */}
          <div className="h-full w-full bg-gradient-to-br from-black via-zinc-900 to-black" />
        </video>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Vignette effect - darker in center where text is */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.4)_70%)]" />
      </div>

      {/* Floating Navigation */}
      <nav className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
        <div className="glass-dark rounded-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/Logo-Only-Dispersal.png"
              alt="Dispersal Digital Agency"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-white font-semibold text-lg">Dispersal Digital Agency</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Services
            </a>
            <a href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              About
            </a>
            <a href="#process" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Process
            </a>
            <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90" asChild>
              <a href="/contact">Get Started</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-8">
          <span className="text-white/90 text-sm font-medium">Cincinnati's Most Creative Digital Agency</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-[1.1] text-balance">
          We Build Digital
          <br />
          <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Experiences</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-light text-pretty drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Premium website design paired with comprehensive digital marketing. We deliver SEO, display advertising, and social media campaigns that drive results, so you can focus on growing your business.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
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
