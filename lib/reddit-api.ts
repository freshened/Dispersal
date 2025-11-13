export interface RedditAdsData {
  impressions: number
  clicks: number
  spend: number
  conversions: number
  ctr: number
  cpc: number
  cpm: number
}

export async function refreshRedditAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: Date }> {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Reddit API credentials not provided")
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  try {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "DispersalAnalytics/1.0 by DispersalDigital",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Reddit API token refresh failed (${response.status})`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    if (!data.access_token) {
      throw new Error("No access token received from Reddit API")
    }

    const expiresAt = data.expires_in
      ? new Date(Date.now() + data.expires_in * 1000)
      : new Date(Date.now() + 3600 * 1000) // Default to 1 hour
    
    return { accessToken: data.access_token, expiresAt }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Unknown error during Reddit API token refresh")
  }
}

export async function getRedditAccessToken(clientId: string, clientSecret: string): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error("Reddit API credentials not provided")
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  try {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "DispersalAnalytics/1.0 by DispersalDigital",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Reddit API authentication failed (${response.status})`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    if (!data.access_token) {
      throw new Error("No access token received from Reddit API")
    }
    
    return data.access_token
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Unknown error during Reddit API authentication")
  }
}

export async function getRedditAccounts(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch("https://ads-api.reddit.com/api/v2.0/accounts", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "DispersalAnalytics/1.0 by DispersalDigital",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Reddit Accounts API Error:", errorText)
      throw new Error(`Failed to fetch Reddit accounts: ${response.status}`)
    }

    const data = await response.json()
    console.log("Reddit Accounts Response:", JSON.stringify(data, null, 2))
    
    return data.data || data.accounts || []
  } catch (error) {
    console.error("Error fetching Reddit accounts:", error)
    throw error
  }
}

export async function fetchRedditAdsData(accessToken: string, accountId: string): Promise<RedditAdsData> {
  if (!accountId) {
    throw new Error("Reddit account ID not provided")
  }

  const endDate = new Date().toISOString().split("T")[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const apiUrl = `https://ads-api.reddit.com/api/v2.0/accounts/${accountId}/reports/campaigns?start_date=${startDate}&end_date=${endDate}`
  
  console.log("Reddit Ads API Request URL:", apiUrl)
  console.log("Reddit Ads API Account ID:", accountId)

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "DispersalAnalytics/1.0 by DispersalDigital",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Reddit Ads API Error Response:", errorText)
      console.error("Reddit Ads API Status:", response.status)
      console.error("Reddit Ads API URL:", apiUrl)
      
      let errorMessage = `Reddit Ads API request failed (${response.status})`
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error_description || errorJson.error || errorMessage
        console.error("Reddit Ads API Error Details:", JSON.stringify(errorJson, null, 2))
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()

    console.log("Reddit API Response:", JSON.stringify(data, null, 2))

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from Reddit API")
    }

    const campaigns = data.data || data.campaigns || []
    
    if (!Array.isArray(campaigns)) {
      console.error("Reddit API response data is not an array:", campaigns)
      throw new Error("Reddit API returned unexpected data format")
    }

    const totals = campaigns.reduce(
      (acc: any, campaign: any) => ({
        impressions: acc.impressions + (campaign.impressions || 0),
        clicks: acc.clicks + (campaign.clicks || 0),
        spend: acc.spend + (campaign.spend || 0),
        conversions: acc.conversions + (campaign.conversions || 0),
      }),
      { impressions: 0, clicks: 0, spend: 0, conversions: 0 }
    )

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0
    const cpm = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0

    return {
      impressions: totals.impressions,
      clicks: totals.clicks,
      spend: totals.spend,
      conversions: totals.conversions,
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: parseFloat(cpc.toFixed(2)),
      cpm: parseFloat(cpm.toFixed(2)),
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Unknown error fetching Reddit Ads data")
  }
}

