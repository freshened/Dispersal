import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Get the base URL - check headers first (for ngrok/proxy), then env var, then request origin
    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const ngrokUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null
    
    // Use production domain as fallback if env var not loaded
    const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dispersal.net"
    
    const baseUrl = envBaseUrl || ngrokUrl || request.nextUrl.origin

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.redirect(new URL("/client-portal", baseUrl))
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      const errorMessage = error === "access_denied" 
        ? "Authorization was cancelled. Please try again."
        : `Authorization failed: ${error}`
      return NextResponse.redirect(
        new URL(`/client-portal/integrations/reddit?error=${encodeURIComponent(errorMessage)}`, baseUrl)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/client-portal/integrations/reddit?error=Authorization failed: Missing authorization code", baseUrl)
      )
    }

    // Verify state
    const cookieStore = await cookies()
    const storedState = cookieStore.get("reddit_oauth_state")?.value

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL("/client-portal/integrations/reddit?error=Security verification failed. Please try again.", baseUrl)
      )
    }

    // Get user's integration to retrieve client credentials
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
        new URL("/client-portal/integrations/reddit?error=Integration not found. Please save your credentials first.", baseUrl)
      )
    }

    // Exchange code for tokens
    const redirectUri = `${baseUrl}/api/auth/reddit/callback`
    
    console.log("Callback - Redirect URI:", redirectUri)
    console.log("Callback - Request Origin:", request.nextUrl.origin)
    console.log("Callback - Base URL:", baseUrl)
    const authString = Buffer.from(`${integration.clientId}:${integration.clientSecret}`).toString("base64")

    const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "DispersalAnalytics/1.0 by DispersalDigital",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Reddit token exchange error:", errorText)
      let errorMessage = "Failed to exchange authorization code for tokens."
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error_description || errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return NextResponse.redirect(
        new URL(`/client-portal/integrations/reddit?error=${encodeURIComponent(errorMessage)}`, baseUrl)
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token || !tokenData.refresh_token) {
      return NextResponse.redirect(
        new URL("/client-portal/integrations/reddit?error=Failed to receive access tokens from Reddit", baseUrl)
      )
    }

    // Calculate token expiration (Reddit tokens typically last 1 hour, but we have refresh token)
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : new Date(Date.now() + 3600 * 1000) // Default to 1 hour

    // Update integration with tokens
    await db.apiIntegration.update({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "reddit",
        },
      },
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    })

    // Clear the state cookie
    const response = NextResponse.redirect(
      new URL("/client-portal/integrations/reddit?success=authorized", baseUrl)
    )
    response.cookies.delete("reddit_oauth_state")

    return response
  } catch (error) {
    console.error("Error in Reddit OAuth callback:", error)
    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const ngrokUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null
    const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dispersal.net"
    const errorBaseUrl = envBaseUrl || ngrokUrl || request.nextUrl.origin
    return NextResponse.redirect(
      new URL("/client-portal/integrations/reddit?error=callback_error", errorBaseUrl)
    )
  }
}

