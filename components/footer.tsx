import Image from "next/image"

export function Footer() {
  return (
    <footer className="relative bg-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/Dispersal-White.png"
                alt="Dispersal Digital Agency"
                width={200}
                height={80}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Premier digital marketing agency. We create stunning websites, provide reliable hosting, and
              deliver results-driven SEO for businesses.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services/web-design" className="text-white/60 hover:text-white text-sm transition-colors">
                  Web Design
                </a>
              </li>
              <li>
                <a href="/services/digital-advertising" className="text-white/60 hover:text-white text-sm transition-colors">
                  Digital Advertising
                </a>
              </li>
              <li>
                <a href="/services/full-stack-development" className="text-white/60 hover:text-white text-sm transition-colors">
                  Full-Stack Development
                </a>
              </li>
              <li>
                <a href="/services/performance-optimization" className="text-white/60 hover:text-white text-sm transition-colors">
                  Performance Optimization
                </a>
              </li>
              <li>
                <a href="/services/analytics-insights" className="text-white/60 hover:text-white text-sm transition-colors">
                  Analytics & Insights
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">Contact Us</li>
              <li className="text-white/60 text-sm">(513) 834-0809</li>
              <li>
                <a
                  href="mailto:drew@dispersal.net"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  drew@dispersal.net
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">© 2025 Dispersal Digital Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-white/40 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-white/40 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
