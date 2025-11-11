import { MessageSquare, Palette, Code, Rocket } from "lucide-react"

export function Process() {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Discovery Call",
      description: "We learn about your business, goals, and vision for your digital presence.",
    },
    {
      number: "02",
      icon: Palette,
      title: "Design & Strategy",
      description: "Our creative team designs a unique website that perfectly represents your brand.",
    },
    {
      number: "03",
      icon: Code,
      title: "Development",
      description: "We build your site with cutting-edge technology, optimized for performance and SEO.",
    },
    {
      number: "04",
      icon: Rocket,
      title: "Launch & Support",
      description: "We handle hosting, maintenance, and ongoing optimization so you can focus on business.",
    },
  ]

  return (
    <section id="process" className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <span className="text-white/90 text-sm font-medium">Our Process</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            From Concept to Launch
            <br />
            <span className="text-white/60">In Four Simple Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="glass-dark rounded-3xl p-8 h-full">
                  <div className="text-6xl font-bold text-white/10 mb-4">{step.number}</div>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/20" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
