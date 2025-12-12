import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { randomInt } from "crypto"
import { db } from "@/lib/db"
import { checkRateLimit, checkIPRateLimit } from "@/lib/rate-limit"

function generateCode(): string {
  return randomInt(100000, 1000000).toString()
}

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return realIP || null
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || "587")
  const secure = process.env.SMTP_SECURE === "true"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error(`SMTP configuration missing: host=${host}, user=${user}, pass=${pass ? '***' : 'missing'}`)
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    console.log("Content-Type header:", contentType)
    
    let body: any
    let email: string | undefined
    
    if (contentType.includes("application/json")) {
      try {
        const rawText = await request.text()
        console.log("Raw request body received:", rawText)
        console.log("Body length:", rawText.length)
        console.log("First 50 chars:", rawText.substring(0, 50))
        
        body = JSON.parse(rawText)
        email = body?.email
        console.log("Successfully parsed JSON, email:", email)
      } catch (parseError) {
        console.error("JSON parse error details:", {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          stack: parseError instanceof Error ? parseError.stack : undefined
        })
        return NextResponse.json(
          { error: "Invalid JSON format", details: parseError instanceof Error ? parseError.message : "Unknown error" },
          { status: 400 }
        )
      }
    } else {
      const formData = await request.formData()
      email = formData.get("email") as string
      body = { email }
    }
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const ipAddress = getClientIP(request)

    const rateLimit = await checkRateLimit(normalizedEmail, 5, 15)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many code requests. Please wait ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before requesting another code.` },
        { status: 429 }
      )
    }

    if (ipAddress) {
      try {
        const ipRateLimit = await checkIPRateLimit(ipAddress, 20, 60)

        if (!ipRateLimit.allowed) {
          return NextResponse.json(
            { error: `Too many code requests from this IP. Please wait ${Math.ceil((ipRateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before requesting another code.` },
            { status: 429 }
          )
        }
      } catch (error) {
        console.warn("IP rate limit check failed, continuing without IP rate limiting:", error)
      }
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Code sent successfully" },
        { status: 200 }
      )
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await db.loginCode.deleteMany({
      where: {
        email: normalizedEmail,
      },
    })

    try {
      const loginCodeData: any = {
        email: normalizedEmail,
        code,
        expiresAt,
      }
      if (ipAddress) {
        loginCodeData.ipAddress = ipAddress
      }
      await db.loginCode.create({
        data: loginCodeData,
      })
    } catch (error) {
      if (error instanceof Error && (error.message.includes("ipAddress") || error.message.includes("Unknown argument"))) {
        await db.loginCode.create({
          data: {
            email: normalizedEmail,
            code,
            expiresAt,
          },
        })
      } else {
        throw error
      }
    }

    const transporter = getTransporter()

    try {
      const mailResult = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Your Client Portal Login Code",
        html: `
          <h2>Your Login Code</h2>
          <p>Your login code for the Dispersal Digital Agency Client Portal is:</p>
          <h1 style="font-size: 36px; letter-spacing: 8px; text-align: center; margin: 30px 0; color: #000; background: #f0f0f0; padding: 20px; border-radius: 8px; display: inline-block; width: 100%;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        `,
        text: `Your login code for the Dispersal Digital Agency Client Portal is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      })
      console.log("Email sent successfully:", mailResult.messageId)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      const emailErrorDetails = emailError instanceof Error ? {
        message: emailError.message,
        stack: emailError.stack,
        name: emailError.name
      } : { error: String(emailError) }
      console.error("Email error details:", JSON.stringify(emailErrorDetails, null, 2))
      throw new Error(`Failed to send email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`)
    }

    return NextResponse.json(
      { message: "Code sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : { error: String(error) }
    console.error("Error sending code:", JSON.stringify(errorDetails, null, 2))
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to send code", details: errorMessage },
      { status: 500 }
    )
  }
}

