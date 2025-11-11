import { Globe, Rocket, Target, Palette, BarChart } from "lucide-react"
import Link from "next/link"

export function Services() {
  const services = [
    {
      icon: Palette,
      title: "Web Design",
      slug: "web-design",
      description: "Stunning, custom websites that captivate your audience and convert visitors into customers. Includes premium hosting with 99.9% uptime.",
    },
    {
      icon: Target,
      title: "Search, Display, and Social Media Ads",
      slug: "digital-advertising",
      description: "Maximize your reach with targeted search ads, eye-catching display campaigns, and engaging social media advertising that drives conversions.",
    },
    {
      icon: Globe,
      title: "Full-Stack Development",
      slug: "full-stack-development",
      description: "From simple sites to complex web applications, we build exactly what you need.",
    },
    {
      icon: Rocket,
      title: "Performance Optimization",
      slug: "performance-optimization",
      description: "Blazing-fast load times and smooth interactions that keep visitors engaged.",
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      slug: "analytics-insights",
      description: "Track your success with detailed analytics and actionable insights for growth.",
    },
  ]

  return (
    <section id="services" className="relative py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <span className="text-white/90 text-sm font-medium">What We Do</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Everything Your Business
            <br />
            <span className="text-white/60">Needs to Thrive Online</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto text-pretty">
            We're not just another agency. We're your complete digital partner, handling every aspect of your online
            presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link
                key={index}
                href={`/services/${service.slug}`}
                className="group glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer block"
              >
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-white/60 leading-relaxed">{service.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
