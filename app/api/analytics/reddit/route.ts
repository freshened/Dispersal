import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { refreshRedditAccessToken, fetchRedditAdsData } from "@/lib/reddit-api"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const integration = await db.apiIntegration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "reddit",
        },
      },
    })

    if (!integration) {
      return NextResponse.json(
        { error: "Reddit integration not configured. Please add your Reddit credentials." },
        { status: 404 }
      )
    }

    if (!integration.accountId) {
      return NextResponse.json(
        { error: "Reddit account ID not configured" },
        { status: 400 }
      )
    }

    if (!integration.refreshToken) {
      return NextResponse.json(
        { error: "Reddit integration not authorized. Please authorize your Reddit account first." },
        { status: 401 }
      )
    }

    try {
      // Check if access token is expired or missing
      const now = new Date()
      const tokenExpired = !integration.accessToken || 
                          !integration.tokenExpiresAt || 
                          integration.tokenExpiresAt <= now

      let accessToken = integration.accessToken

      // Refresh token if expired
      if (tokenExpired) {
        const { accessToken: newToken, expiresAt } = await refreshRedditAccessToken(
          integration.clientId,
          integration.clientSecret,
          integration.refreshToken
        )

        // Update the integration with new token
        await db.apiIntegration.update({
          where: {
            userId_provider: {
              userId: user.id,
              provider: "reddit",
            },
          },
          data: {
            accessToken: newToken,
            tokenExpiresAt: expiresAt,
          },
        })

        accessToken = newToken
      }

      if (!accessToken) {
        throw new Error("Failed to obtain access token")
      }

      const data = await fetchRedditAdsData(accessToken, integration.accountId)

      return NextResponse.json({ data }, { status: 200 })
    } catch (authError) {
      console.error("Reddit API authentication error:", authError)
      const authErrorMessage = authError instanceof Error ? authError.message : "Unknown authentication error"
      
      if (authErrorMessage.includes("500") || authErrorMessage.includes("Internal Server Error")) {
        return NextResponse.json(
          { 
            error: "Reddit API authentication failed. Please re-authorize your Reddit account.",
            details: authErrorMessage
          },
          { status: 500 }
        )
      }
      
      throw authError
    }
  } catch (error) {
    console.error("Error fetching Reddit Ads data:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to fetch Reddit Ads data", details: errorMessage },
      { status: 500 }
    )
  }
}

