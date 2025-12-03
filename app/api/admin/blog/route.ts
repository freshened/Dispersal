import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

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

    return NextResponse.json({
      post: {
        id: newPost.id,
        slug: newPost.slug,
        title: newPost.title,
        author: newPost.author,
        createdAt: newPost.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}

