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
    "click here", "buy now", "limited time", "act now",
    "guaranteed", "no risk", "100% free", "no credit check",
    "debt consolidation", "refinance", "lower interest",
    "weight loss", "lose weight fast", "diet pills",
    "rolex", "replica", "cheap watches", "luxury watches"
  ]
  // Note: "urgent" removed from spam keywords as it's a legitimate field in roof assessment forms
  const lowerText = text.toLowerCase()
  return spamKeywords.some(keyword => lowerText.includes(keyword))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address, city, state, zipCode, message, website, formLoadTime } = body

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: "Name, phone, and address are required" },
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

    const normalizedEmail = email ? email.toLowerCase().trim() : null
    const ipAddress = getClientIP(request)

    const rateLimit = await checkContactRateLimit(normalizedEmail, ipAddress, 3, 60)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before submitting again.` },
        { status: 429 }
      )
    }

    // Check spam keywords, but exclude the message field which may contain legitimate urgency/roof-related terms
    const fullText = `${name} ${email} ${phone} ${address} ${city || ""} ${state || ""}`.toLowerCase()

    if (containsSpamKeywords(fullText)) {
      return NextResponse.json(
        { error: "Spam detected" },
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

    const fullAddress = [address, city, state, zipCode].filter(Boolean).join(", ")

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || "drew@dispersal.net",
      replyTo: email || process.env.SMTP_FROM || process.env.SMTP_USER,
      subject: `New Roof Assessment Request from ${name} - Stuart Conrad Roofing`,
      html: `
        <h2>New Roof Assessment Request - Stuart Conrad Roofing</h2>
        <p><strong>Name:</strong> ${name}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${fullAddress}</p>
        ${message ? `<p><strong>Additional Information:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
      `,
      text: `
New Roof Assessment Request - Stuart Conrad Roofing

Name: ${name}
${email ? `Email: ${email}` : ""}
Phone: ${phone}
Address: ${fullAddress}
${message ? `\nAdditional Information:\n${message}` : ""}

Submitted at: ${new Date().toLocaleString()}
      `,
    }

    await transporter.sendMail(mailOptions)

    const shouldSaveToDatabase = process.env.DATABASE_URL && process.env.ENABLE_DB_SAVE !== "false"
    
    if (shouldSaveToDatabase) {
      try {
        await db.roofAssessmentLead.create({
          data: {
            name,
            email: normalizedEmail || null,
            phone,
            address,
            city: city || null,
            state: state || null,
            zipCode: zipCode || null,
            message: message || null,
            ipAddress,
          },
        })
      } catch (error) {
        console.warn("Failed to save lead to database (database may not be configured):", error)
      }
    }

    return NextResponse.json(
      { message: "Roof assessment request submitted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error submitting roof assessment:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to submit request", details: errorMessage },
      { status: 500 }
    )
  }
}

