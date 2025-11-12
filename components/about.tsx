import Image from "next/image"
import { Briefcase, Code, Brain, Rocket, Database, TrendingUp, Globe, Zap } from "lucide-react"

export function About() {
  const professionalWork = [
    {
      icon: Brain,
      title: "AI Computer Vision Platform",
      description:
        "Architected and deployed a global AI system that analyzes live security camera feeds to monitor workforce activity and operational flow. It identifies behavioral patterns such as repeated absences from work areas to improve staffing efficiency. The system is being rolled out to 100+ sites across 50 countries.",
    },
    {
      icon: Globe,
      title: "Canada Post Reroute & MQ Messaging",
      description:
        "Built and implemented a cross-border rerouting system using IBM MQ, enabling real-time diversion of Canadian shipments through U.S. hubs during the Canada Post strike. Designed, tested, and deployed independently under production conditions.",
    },
    {
      icon: Database,
      title: "Mexico Tax & Tariff Automation (SAT Integration)",
      description:
        "Developed a compliance automation system integrated with SATS (Servicio de Administración Tributaria) to manage customs validation and tariff handling for DHL's Mexico operations—still actively in use.",
    },
    {
      icon: Briefcase,
      title: "Inventory & Labor Systems",
      description:
        "Created internal inventory tracking and vacation planning tools leveraging SQL Server stored procedures and Razor-based interfaces. These systems improved accuracy and scheduling efficiency across operational teams.",
    },
    {
      icon: Zap,
      title: "AI Chatbots & Data Tools",
      description:
        "Engineered conversational and analytical interfaces for automated data retrieval, reporting, and workflow optimization across DHL environments.",
    },
  ]

  const independentProjects = [
    {
      icon: TrendingUp,
      title: "NBA Prop Analytics Platform",
      description:
        "Designed a quantitative analysis tool leveraging Monte Carlo simulation to evaluate player prop outcomes, simulate thousands of game scenarios, and generate probability-based betting insights.",
    },
    {
      icon: Code,
      title: "Stock Market Research & AI Modeling",
      description:
        "Created experimental models for equity movement prediction, feature engineering, and options backtesting using Python, SQLite, and statistical pattern recognition.",
    },
    {
      icon: Rocket,
      title: "Personal AI & Web Projects",
      description:
        "Regularly prototype AI agents, automation scripts, and full-stack applications across web, data, and computer vision domains.",
    },
  ]

  return (
    <section id="about" className="relative py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-6">
            <span className="text-white/90 text-sm font-medium">About Me</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Meet the Developer
            <br />
            <span className="text-white/60">Behind Dispersal</span>
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <div className="glass-dark rounded-3xl p-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white/20 ring-4 ring-white/10">
                <Image
                  src="/profilepic.jpg"
                  alt="Developer Profile"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Andrew Tufarella</h3>
            <p className="text-lg text-white/80 mb-2 font-medium">Senior Software Developer</p>
            <p className="text-base text-white/60 mb-6">DHL Express</p>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
              I'm a Senior Software Developer at DHL Express with deep expertise in enterprise automation, AI, and
              applied data systems. I design and deploy high-impact software that connects global logistics, data
              intelligence, and machine learning at scale.
            </p>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mt-4">
              I focus on creating intelligent systems that make complex operations measurable, adaptive, and
              predictive. Whether in logistics, AI, or quantitative analytics.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional Work at DHL</h3>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Enterprise-level solutions that drive operational efficiency and global logistics intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionalWork.map((project, index) => {
              const Icon = project.icon
              return (
                <div key={index} className="glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-black" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">{project.title}</h4>
                  <p className="text-white/60 leading-relaxed">{project.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Independent Projects</h3>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Experimental systems that merge machine learning, simulation, and market data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {independentProjects.map((project, index) => {
              const Icon = project.icon
              return (
                <div key={index} className="glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-black" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">{project.title}</h4>
                  <p className="text-white/60 leading-relaxed">{project.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

