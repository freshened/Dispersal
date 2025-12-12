import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { submitBlogPostToGoogle } from "@/lib/google-indexing"
import { submitBlogPostToIndexNow } from "@/lib/indexnow"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const posts = await db.blogPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { slug, title, author, content } = body

    if (!slug || !title || !author || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const existingPost = await db.blogPost.findUnique({
      where: { slug: normalizedSlug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this endpoint already exists" },
        { status: 400 }
      )
    }

    const newPost = await db.blogPost.create({
      data: {
        slug: normalizedSlug,
        title,
        author,
        content,
      },
    })

    const [googleSubmission, indexNowSubmission] = await Promise.all([
      submitBlogPostToGoogle(normalizedSlug),
      submitBlogPostToIndexNow(normalizedSlug),
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
      where: { id: newPost.id },
      data: updateData,
    })

    const updatedPost = await db.blogPost.findUnique({
      where: { id: newPost.id },
    })

    revalidatePath("/sitemap.xml")

    return NextResponse.json({
      post: {
        id: updatedPost!.id,
        slug: updatedPost!.slug,
        title: updatedPost!.title,
        author: updatedPost!.author,
        createdAt: updatedPost!.createdAt,
        googleIndexed: updatedPost!.googleIndexed,
        googleIndexedAt: updatedPost!.googleIndexedAt,
        googleIndexingError: updatedPost!.googleIndexingError,
        indexNowIndexed: updatedPost!.indexNowIndexed,
        indexNowIndexedAt: updatedPost!.indexNowIndexedAt,
        indexNowError: updatedPost!.indexNowError,
      },
      googleIndexing: googleSubmission,
      indexNow: indexNowSubmission,
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}

