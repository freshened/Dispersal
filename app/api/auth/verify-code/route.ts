import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"
import { checkVerificationRateLimit, checkIPVerificationRateLimit } from "@/lib/rate-limit"

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return realIP || null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const ipAddress = getClientIP(request)

    const rateLimit = await checkVerificationRateLimit(normalizedEmail, 10, 15)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please wait ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before trying again.` },
        { status: 429 }
      )
    }

    if (ipAddress) {
      try {
        const ipRateLimit = await checkIPVerificationRateLimit(ipAddress, 30, 15)

        if (!ipRateLimit.allowed) {
          return NextResponse.json(
            { error: `Too many verification attempts from this IP. Please wait ${Math.ceil((ipRateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before trying again.` },
            { status: 429 }
          )
        }
      } catch (error) {
        console.warn("IP rate limit check failed, continuing without IP rate limiting:", error)
      }
    }

    const loginCode = await db.loginCode.findFirst({
      where: {
        email: normalizedEmail,
        code,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!loginCode) {
      return NextResponse.json(
        { error: "Invalid or expired code. Please request a new code." },
        { status: 400 }
      )
    }

    await db.loginCode.update({
      where: { id: loginCode.id },
      data: { used: true },
    })

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

    await db.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    })

    const response = NextResponse.json(
      { message: "Code verified successfully" },
      { status: 200 }
    )

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60,
      path: "/",
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

