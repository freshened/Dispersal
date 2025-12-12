import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { removeBlogPostFromGoogle } from "@/lib/google-indexing"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { id } = await params

    const post = await db.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }

    const googleRemoval = await removeBlogPostFromGoogle(post.slug)
    
    await db.blogPost.delete({
      where: { id },
    })

    revalidatePath("/sitemap.xml")

    return NextResponse.json({ 
      success: true,
      googleIndexing: googleRemoval,
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}

