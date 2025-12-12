import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { submitSitemapToIndexNow } from "@/lib/indexnow"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const result = await submitSitemapToIndexNow()

    return NextResponse.json({
      success: result.success,
      submitted: result.submitted,
      failed: result.failed,
      errors: result.errors,
      message: result.success
        ? `Successfully submitted ${result.submitted} URLs to IndexNow`
        : `Failed to submit URLs. ${result.failed} failed.`,
    })
  } catch (error) {
    console.error("Error submitting sitemap to IndexNow:", error)
    return NextResponse.json(
      { error: "Failed to submit sitemap to IndexNow" },
      { status: 500 }
    )
  }
}

