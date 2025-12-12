const INDEXNOW_API_URL = "https://api.indexnow.org/IndexNow"
const BASE_URL = "https://dispersal.net"
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || ""

export async function submitUrlToIndexNow(url: string): Promise<{ success: boolean; error?: string }> {
  if (!INDEXNOW_KEY) {
    const message = "IndexNow key not configured. Skipping URL submission."
    console.warn(message)
    return { success: false, error: message }
  }

  try {
    const keyLocation = `${BASE_URL}/${INDEXNOW_KEY}.txt`
    const hostname = new URL(BASE_URL).hostname.replace("www.", "")
    
    const payload = {
      host: hostname,
      key: INDEXNOW_KEY,
      keyLocation: keyLocation,
      urlList: [url],
    }

    const response = await fetch(INDEXNOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`Successfully submitted to IndexNow: ${url}`)
      return { success: true }
    } else if (response.status === 403) {
      const errorMessage = "IndexNow key validation failed"
      console.error(`IndexNow error (403): ${errorMessage}`)
      return { success: false, error: errorMessage }
    } else if (response.status === 422) {
      const errorMessage = "IndexNow URL validation failed"
      console.error(`IndexNow error (422): ${errorMessage}`)
      return { success: false, error: errorMessage }
    } else if (response.status === 429) {
      const errorMessage = "IndexNow rate limit exceeded"
      console.error(`IndexNow error (429): ${errorMessage}`)
      return { success: false, error: errorMessage }
    } else {
      const errorText = await response.text()
      const errorMessage = `IndexNow API error: ${response.status} - ${errorText}`
      console.error(`IndexNow error: ${errorMessage}`)
      return { success: false, error: errorMessage }
    }
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error"
    console.error(`Error submitting URL to IndexNow: ${url}`, errorMessage, error)
    return { success: false, error: errorMessage }
  }
}

export async function submitBlogPostToIndexNow(slug: string): Promise<{ success: boolean; error?: string }> {
  const url = `${BASE_URL}/blog/${slug}`
  return submitUrlToIndexNow(url)
}

export async function removeBlogPostFromIndexNow(slug: string): Promise<{ success: boolean; error?: string }> {
  const url = `${BASE_URL}/blog/${slug}`
  return submitUrlToIndexNow(url)
}

export async function submitMultipleUrlsToIndexNow(urls: string[]): Promise<{ success: boolean; submitted: number; failed: number; errors?: string[] }> {
  if (!INDEXNOW_KEY) {
    const message = "IndexNow key not configured. Skipping URL submission."
    console.warn(message)
    return { success: false, submitted: 0, failed: urls.length, errors: [message] }
  }

  if (urls.length === 0) {
    return { success: true, submitted: 0, failed: 0 }
  }

  try {
    const keyLocation = `${BASE_URL}/${INDEXNOW_KEY}.txt`
    const hostname = new URL(BASE_URL).hostname.replace("www.", "")
    
    const payload = {
      host: hostname,
      key: INDEXNOW_KEY,
      keyLocation: keyLocation,
      urlList: urls,
    }

    const response = await fetch(INDEXNOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`Successfully submitted ${urls.length} URLs to IndexNow`)
      return { success: true, submitted: urls.length, failed: 0 }
    } else {
      const errorText = await response.text()
      const errorMessage = `IndexNow API error: ${response.status} - ${errorText}`
      console.error(`IndexNow error: ${errorMessage}`)
      return { success: false, submitted: 0, failed: urls.length, errors: [errorMessage] }
    }
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error"
    console.error(`Error submitting URLs to IndexNow:`, errorMessage, error)
    return { success: false, submitted: 0, failed: urls.length, errors: [errorMessage] }
  }
}

export async function submitSitemapToIndexNow(): Promise<{ success: boolean; submitted: number; failed: number; errors?: string[] }> {
  const baseUrl = "https://dispersal.net"
  
  const staticPages = [
    baseUrl,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    `${baseUrl}/blog`,
    `${baseUrl}/services/web-design`,
    `${baseUrl}/services/digital-advertising`,
    `${baseUrl}/services/full-stack-development`,
    `${baseUrl}/services/performance-optimization`,
    `${baseUrl}/services/analytics-insights`,
    `${baseUrl}/privacy-policy`,
    `${baseUrl}/terms-of-service`,
  ]

  try {
    const { db } = await import("@/lib/db")
    const blogPosts = await db.blogPost.findMany({
      select: {
        slug: true,
      },
    })

    const blogUrls = blogPosts.map((post) => `${baseUrl}/blog/${post.slug}`)
    const allUrls = [...staticPages, ...blogUrls]

    console.log(`Submitting ${allUrls.length} URLs from sitemap to IndexNow...`)
    return await submitMultipleUrlsToIndexNow(allUrls)
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error"
    console.error("Error fetching blog posts for IndexNow submission:", errorMessage)
    return await submitMultipleUrlsToIndexNow(staticPages)
  }
}

