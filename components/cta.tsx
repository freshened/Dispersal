import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
          Ready to Transform
          <br />
          <span className="text-white/60">Your Digital Presence?</span>
        </h2>

        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto text-pretty">
          Join hundreds of businesses who trust us with their digital success. Let's create something
          extraordinary together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 h-14 text-base font-semibold glass-dark bg-transparent"
          >
            Call (513) 834-0809
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-white mb-2">Free</div>
            <div className="text-sm text-white/60">Consultation</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">30 Days</div>
            <div className="text-sm text-white/60">To Launch</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-white/60">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
