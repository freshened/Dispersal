import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Dispersal Digital Agency",
  description:
    "Get in touch with Dispersal Digital Agency. Fill out our contact form or reach us directly at (513) 834-0809 or drew@dispersal.net to start your project.",
  keywords:
    "contact, get in touch, web design contact, digital marketing contact, Cincinnati web agency, contact form",
  openGraph: {
    title: "Contact Us | Dispersal Digital Agency",
    description:
      "Get in touch with Dispersal Digital Agency. Fill out our contact form or reach us directly to start your project.",
    type: "website",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

