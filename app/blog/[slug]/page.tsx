import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"

type BlogPost = {
  id: string
  slug: string
  title: string
  author: string
  content: string
  createdAt: Date
  updatedAt: Date
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { db } = await import("@/lib/db")
    const post = await db.blogPost.findUnique({
      where: { slug },
    })
    return post
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found | Dispersal Digital Agency",
    }
  }

  const description = post.content
    .replace(/<[^>]*>/g, "")
    .substring(0, 160)
    .trim()

  return {
    title: `${post.title} | Dispersal Digital Agency Blog`,
    description: description || `Read ${post.title} by ${post.author} on Dispersal Digital Agency's blog.`,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://dispersal.net/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: description || `Read ${post.title} by ${post.author}.`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      url: `https://dispersal.net/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description || `Read ${post.title} by ${post.author}.`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const isAndrew = post.author.toLowerCase().includes("andrew") || post.author.toLowerCase().includes("tufarella") || post.author.toLowerCase() === "andrew tufarella"

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Link href="/blog" className="mb-6 inline-block">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              {isAndrew ? (
                <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/30">
                  <Image
                    src="/profilepic.jpg"
                    alt="Andrew Tufarella"
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                    sizes="24px"
                  />
                </div>
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="glass-dark rounded-2xl p-8 border-white/10">
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-white leading-relaxed break-words overflow-wrap-anywhere"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              />
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}

