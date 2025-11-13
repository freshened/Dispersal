import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"
import { checkVerificationRateLimit } from "@/lib/rate-limit"

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

    const rateLimit = await checkVerificationRateLimit(normalizedEmail, 10, 15)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please wait ${Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)} minutes before trying again.` },
        { status: 429 }
      )
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

