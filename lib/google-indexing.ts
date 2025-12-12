import { google } from "googleapis"
import { readFileSync } from "fs"
import { join } from "path"

const baseUrl = "https://dispersal.net"

function getGoogleAuth() {
  const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH

  if (!serviceAccountPath) {
    return null
  }

  try {
    const filePath = join(process.cwd(), serviceAccountPath)
    const serviceAccount = JSON.parse(readFileSync(filePath, "utf-8"))
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/indexing"],
    })
    return auth
  } catch (error) {
    console.error("Error loading Google service account:", error)
    return null
  }
}

export async function submitUrlToGoogleIndexing(url: string, type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"): Promise<{ success: boolean; error?: string }> {
  const auth = getGoogleAuth()

  if (!auth) {
    const message = "Google Indexing API not configured. Skipping URL submission."
    console.warn(message)
    return { success: false, error: message }
  }

  try {
    const indexing = google.indexing({ version: "v3", auth })

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type,
      },
    })

    console.log(`Successfully submitted ${type} to Google Indexing API: ${url}`, response.data)
    return { success: true }
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error"
    console.error(`Error submitting URL to Google Indexing API: ${url}`, errorMessage, error)
    return { success: false, error: errorMessage }
  }
}

export async function submitBlogPostToGoogle(slug: string): Promise<{ success: boolean; error?: string }> {
  const url = `${baseUrl}/blog/${slug}`
  return submitUrlToGoogleIndexing(url, "URL_UPDATED")
}

export async function removeBlogPostFromGoogle(slug: string): Promise<{ success: boolean; error?: string }> {
  const url = `${baseUrl}/blog/${slug}`
  return submitUrlToGoogleIndexing(url, "URL_DELETED")
}

