"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] md:hidden bg-black/80 backdrop-blur-md rounded-full p-4 shadow-lg hover:bg-black/90 border border-white/20 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="!bg-black border-white/20 w-[280px] flex items-center justify-center !z-[9999]"
          style={{ zIndex: 9999 }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 items-center">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
            >
              Home
            </Link>
            <Link
              href="/#services"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
            >
              About
            </Link>
            <Link
              href="/#process"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
            >
              Process
            </Link>
            <Link
              href="/client-portal"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
            >
              Client Portal
            </Link>
            <Button
              size="lg"
              className="rounded-full bg-white text-black hover:bg-white/90 mt-4"
              asChild
            >
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

