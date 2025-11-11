export function Stats() {
  const stats = [
    { value: "50+", label: "Websites Launched", company: "Successful Projects" },
    { value: "100%", label: "Client Satisfaction", company: "Verified Reviews" },
    { value: "3x", label: "Average Traffic Growth", company: "SEO Results" },
    { value: "24/7", label: "Support & Hosting", company: "Always Online" },
  ]

  return (
    <section className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-dark rounded-3xl p-8 text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-lg text-white/80 font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-white/50">{stat.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
