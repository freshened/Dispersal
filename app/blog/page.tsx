import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User } from "lucide-react"

async function getBlogPosts() {
  try {
    const { db } = await import("@/lib/db")
    const posts = await db.blogPost.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Blog</h1>
          <p className="text-lg text-white/80">Latest articles and insights</p>
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          {posts.length === 0 ? (
            <Card className="glass-dark rounded-2xl p-12 border-white/10 text-center">
              <p className="text-white/60 text-lg">No blog posts yet. Check back soon!</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                    <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>
                    <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Read More
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

