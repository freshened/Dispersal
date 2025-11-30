import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

function getDeviceType(userAgent: string | null): string | null {
  if (!userAgent) return null
  const ua = userAgent.toLowerCase()
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "mobile"
  }
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet"
  }
  return "desktop"
}

function getBrowser(userAgent: string | null): string | null {
  if (!userAgent) return null
  const ua = userAgent.toLowerCase()
  if (ua.includes("chrome") && !ua.includes("edg")) return "Chrome"
  if (ua.includes("firefox")) return "Firefox"
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
  if (ua.includes("edg")) return "Edge"
  if (ua.includes("opera") || ua.includes("opr")) return "Opera"
  return "Other"
}

function getOS(userAgent: string | null): string | null {
  if (!userAgent) return null
  const ua = userAgent.toLowerCase()
  if (ua.includes("windows")) return "Windows"
  if (ua.includes("mac os")) return "macOS"
  if (ua.includes("linux")) return "Linux"
  if (ua.includes("android")) return "Android"
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) return "iOS"
  return "Other"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer, userAgent, ipAddress } = body

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    const sessionId = request.cookies.get("analytics_session")?.value || 
                      `${Date.now()}-${Math.random().toString(36).substring(7)}`

    await db.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        deviceType: getDeviceType(userAgent),
        browser: getBrowser(userAgent),
        os: getOS(userAgent),
        sessionId,
      },
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set("analytics_session", sessionId, {
      maxAge: 30 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}

