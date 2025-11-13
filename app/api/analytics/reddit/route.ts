import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { refreshRedditAccessToken, fetchRedditAdsData, getRedditAccounts } from "@/lib/reddit-api"

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

    let accountId: string | null = integration.accountId

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

      if (!accountId) {
        console.log("No account ID configured, fetching accounts from Reddit...")
        const accounts = await getRedditAccounts(accessToken)
        if (accounts.length === 0) {
          throw new Error("No Reddit ad accounts found. Please create an ad account first.")
        }
        accountId = accounts[0].id || accounts[0].account_id || null
        if (!accountId) {
          throw new Error("Could not determine account ID from Reddit response")
        }
        console.log("Using account ID from Reddit:", accountId)
        
        await db.apiIntegration.update({
          where: {
            userId_provider: {
              userId: user.id,
              provider: "reddit",
            },
          },
          data: {
            accountId: accountId,
          },
        })
      }

      if (!accountId) {
        throw new Error("Account ID is required but not available")
      }

      let data
      try {
        data = await fetchRedditAdsData(accessToken, accountId)
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.message.includes("404")) {
          console.log("Account ID failed with 404, fetching correct account ID from Reddit...")
          const accounts = await getRedditAccounts(accessToken)
          if (accounts.length === 0) {
            throw new Error("No Reddit ad accounts found. Please create an ad account first.")
          }
          const correctAccountId = accounts[0].id || accounts[0].account_id || accounts[0].uuid
          if (!correctAccountId) {
            throw new Error("Could not determine account ID from Reddit response")
          }
          console.log("Found correct account ID:", correctAccountId)
          
          await db.apiIntegration.update({
            where: {
              userId_provider: {
                userId: user.id,
                provider: "reddit",
              },
            },
            data: {
              accountId: correctAccountId,
            },
          })
          
          data = await fetchRedditAdsData(accessToken, correctAccountId)
        } else {
          throw fetchError
        }
      }

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

