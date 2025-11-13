"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
      <div className="glass-dark rounded-full px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo-Only-Dispersal.png"
            alt="Dispersal Digital Agency"
            width={32}
            height={32}
            className="h-8 w-auto"
            sizes="32px"
          />
          <span className="text-white font-semibold text-lg">Dispersal Digital Agency</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#services" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            Services
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            About
          </Link>
          <Link href="/#process" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            Process
          </Link>
          <Link href="/client-portal" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            Client Portal
          </Link>
          <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

