import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { removeBlogPostFromGoogle } from "@/lib/google-indexing"
import { removeBlogPostFromIndexNow, submitBlogPostToIndexNow } from "@/lib/indexnow"

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

    const [googleRemoval, indexNowRemoval] = await Promise.all([
      removeBlogPostFromGoogle(post.slug),
      removeBlogPostFromIndexNow(post.slug),
    ])
    
    await db.blogPost.delete({
      where: { id },
    })

    revalidatePath("/sitemap.xml")

    return NextResponse.json({ 
      success: true,
      googleIndexing: googleRemoval,
      indexNow: indexNowRemoval,
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const body = await request.json()
    const { action } = body

    const post = await db.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }

    if (action === "submit-to-google") {
      const { submitBlogPostToGoogle } = await import("@/lib/google-indexing")
      const googleSubmission = await submitBlogPostToGoogle(post.slug)
      
      if (googleSubmission.success) {
        await db.blogPost.update({
          where: { id },
          data: {
            googleIndexed: true,
            googleIndexedAt: new Date(),
            googleIndexingError: null,
          },
        })
      } else {
        await db.blogPost.update({
          where: { id },
          data: {
            googleIndexed: false,
            googleIndexingError: googleSubmission.error || "Unknown error",
          },
        })
      }

      const updatedPost = await db.blogPost.findUnique({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        post: updatedPost,
        googleIndexing: googleSubmission,
      })
    }
    
    if (action === "submit-to-indexnow") {
      const indexNowSubmission = await submitBlogPostToIndexNow(post.slug)
      
      if (indexNowSubmission.success) {
        await db.blogPost.update({
          where: { id },
          data: {
            indexNowIndexed: true,
            indexNowIndexedAt: new Date(),
            indexNowError: null,
          },
        })
      } else {
        await db.blogPost.update({
          where: { id },
          data: {
            indexNowIndexed: false,
            indexNowError: indexNowSubmission.error || "Unknown error",
          },
        })
      }

      const updatedPost = await db.blogPost.findUnique({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        post: updatedPost,
        indexNow: indexNowSubmission,
      })
    }
    
    if (action === "submit-to-all") {
      const { submitBlogPostToGoogle } = await import("@/lib/google-indexing")
      const [googleSubmission, indexNowSubmission] = await Promise.all([
        submitBlogPostToGoogle(post.slug),
        submitBlogPostToIndexNow(post.slug),
      ])
      
      const updateData: any = {}
      
      if (googleSubmission.success) {
        updateData.googleIndexed = true
        updateData.googleIndexedAt = new Date()
        updateData.googleIndexingError = null
      } else {
        updateData.googleIndexed = false
        updateData.googleIndexingError = googleSubmission.error || "Unknown error"
      }
      
      if (indexNowSubmission.success) {
        updateData.indexNowIndexed = true
        updateData.indexNowIndexedAt = new Date()
        updateData.indexNowError = null
      } else {
        updateData.indexNowIndexed = false
        updateData.indexNowError = indexNowSubmission.error || "Unknown error"
      }
      
      await db.blogPost.update({
        where: { id },
        data: updateData,
      })

      const updatedPost = await db.blogPost.findUnique({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        post: updatedPost,
        googleIndexing: googleSubmission,
        indexNow: indexNowSubmission,
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

