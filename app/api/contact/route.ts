import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"
import { checkContactRateLimit } from "@/lib/rate-limit"

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return realIP || null
}

function containsSpamKeywords(text: string): boolean {
  const spamKeywords = [
    "viagra", "cialis", "casino", "poker", "lottery", "winner", "prize",
    "free money", "make money fast", "work from home", "get rich",
    "click here", "buy now", "limited time", "act now", "urgent",
    "guaranteed", "no risk", "100% free", "no credit check",
    "debt consolidation", "refinance", "lower interest",
    "weight loss", "lose weight fast", "diet pills",
    "rolex", "replica", "cheap watches", "luxury watches"
  ]
  const lowerText = text.toLowerCase()
  return spamKeywords.some(keyword => lowerText.includes(keyword))
}

function countLinks(text: string): number {
  const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi
  const matches = text.match(urlPattern)
  return matches ? matches.length : 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message, website, formLoadTime } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    if (website && website.trim() !== "") {
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      )
    }

    if (formLoadTime) {
      const timeSpent = Date.now() - formLoadTime
      if (timeSpent < 3000) {
        return NextResponse.json(
          { error: "Please take your time filling out the form" },
          { status: 400 }
        )
      }
    }

    const normalizedEmail = email.toLowerCase().trim()
    const ipAddress = getClientIP(request)

    const rateLimit = await checkContactRateLimit(normalizedEmail, ipAddress, 3, 60)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before submitting again.` },
        { status: 429 }
      )
    }

    const fullText = `${name} ${email} ${message} ${company || ""} ${phone || ""}`.toLowerCase()

    if (containsSpamKeywords(fullText)) {
      await db.contactSubmission.create({
        data: {
          email: normalizedEmail,
          ipAddress,
        },
      })
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      )
    }

    const linkCount = countLinks(message)
    if (linkCount > 3) {
      await db.contactSubmission.create({
        data: {
          email: normalizedEmail,
          ipAddress,
        },
      })
      return NextResponse.json(
        { error: "Too many links in message" },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || "drew@dispersal.net",
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
${company ? `Company: ${company}` : ""}

Message:
${message}
      `,
    }

    await transporter.sendMail(mailOptions)

    await db.contactSubmission.create({
      data: {
        email: normalizedEmail,
        ipAddress,
      },
    })

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending email:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to send email", details: errorMessage },
      { status: 500 }
    )
  }
}

