import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"

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
          <div className="absolute top-0 left-4 md:left-8">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Back</span>
              </Button>
            </Link>
          </div>
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass-dark rounded-2xl p-8 border-white/10">
                <div className="prose prose-invert max-w-none">
                  <div className="text-white whitespace-pre-wrap leading-relaxed">{post.content}</div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="glass-dark rounded-2xl p-6 border-white/10 sticky top-8">
                <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
                {isAndrew ? (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/20">
                        <Image
                          src="/profilepic.jpg"
                          alt="Andrew Tufarella"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                          sizes="96px"
                        />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white text-center mb-1">Andrew Tufarella</h4>
                    <p className="text-sm text-white/60 text-center mb-2">Senior Software Developer</p>
                    <p className="text-sm text-white/60 text-center mb-4">DHL Express</p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Senior Software Developer at DHL Express with deep expertise in enterprise automation, AI, and applied data systems.
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-white/40" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{post.author}</h4>
                    <p className="text-sm text-white/60">Contributor</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

