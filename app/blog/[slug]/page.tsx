import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

async function getBlogPost(slug: string) {
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="outline" className="mb-6 border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
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
              <div className="text-white whitespace-pre-wrap leading-relaxed">{post.content}</div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}

