import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.redirect(new URL("/client-portal", request.url))
    }

    // Get user's integration to retrieve client ID
    const integration = await db.apiIntegration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "reddit",
        },
      },
    })

    if (!integration) {
      return NextResponse.redirect(
        new URL("/client-portal/integrations/reddit?error=integration_not_found", request.url)
      )
    }

    if (!integration.clientId) {
      return NextResponse.redirect(
        new URL("/client-portal/integrations/reddit?error=client_id_missing", request.url)
      )
    }

    const state = randomBytes(32).toString("hex")
    
    // Get the base URL - check headers first (for ngrok/proxy), then env var, then request origin
    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const ngrokUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null
    
    // Use production domain as fallback if env var not loaded
    const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dispersal.net"
    
    const baseUrl = envBaseUrl || ngrokUrl || request.nextUrl.origin
    const redirectUri = `${baseUrl}/api/auth/reddit/callback`
    
    // Log the redirect URI for debugging (remove in production)
    console.log("Reddit OAuth Redirect URI:", redirectUri)
    console.log("Base URL:", baseUrl)
    console.log("Request Origin:", request.nextUrl.origin)
    console.log("Forwarded Host:", forwardedHost)
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL)
    
    // Store state in a cookie for verification
    const response = NextResponse.redirect(
      `https://www.reddit.com/api/v1/authorize?client_id=${integration.clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&duration=permanent&scope=adsread,adsconversions,history,adsedit,read`
    )

    response.cookies.set("reddit_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error initiating Reddit OAuth:", error)
    return NextResponse.redirect(new URL("/client-portal/integrations/reddit?error=oauth_failed", request.url))
  }
}

