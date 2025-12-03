"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FileText, DollarSign, Calendar, Settings, LogOut, User, BarChart3, Users, Eye, Clock, Globe, Plus, TrendingUp, Trash2, BookOpen } from "lucide-react"
import dynamic from "next/dynamic"

const RichTextEditor = dynamic(
  () => import("@/components/rich-text-editor").then((mod) => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white/10 border border-white/20 rounded-lg p-4 min-h-[200px]">
        <p className="text-white/50">Loading editor...</p>
      </div>
    ),
  }
)

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string | null; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [addingUser, setAddingUser] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [newBlogSlug, setNewBlogSlug] = useState("")
  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogContent, setNewBlogContent] = useState("")
  const [addingBlog, setAddingBlog] = useState(false)
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          if (data.user.role === "admin") {
            loadAnalytics()
            loadUsers()
            loadBlogPosts()
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch("/api/analytics/website?days=30")
      const data = await res.json()
      if (res.ok) {
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingUser(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName || null,
          role: "client",
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewUserEmail("")
        setNewUserName("")
        loadUsers()
      } else {
        alert(data.error || "Failed to add user")
      }
    } catch (error) {
      alert("Failed to add user")
    } finally {
      setAddingUser(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    setDeletingUserId(userId)
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (res.ok) {
        loadUsers()
      } else {
        alert(data.error || "Failed to delete user")
      }
    } catch (error) {
      alert("Failed to delete user")
    } finally {
      setDeletingUserId(null)
    }
  }

  const loadBlogPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog")
      const data = await res.json()
      if (res.ok) {
        setBlogPosts(data.posts)
      }
    } catch (error) {
      console.error("Error loading blog posts:", error)
    }
  }

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const textContent = newBlogContent.replace(/<[^>]*>/g, "").trim()
    if (!textContent) {
      alert("Please enter some content for the blog post")
      return
    }
    
    setAddingBlog(true)
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newBlogSlug,
          title: newBlogTitle,
          author: newBlogAuthor,
          content: newBlogContent,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewBlogSlug("")
        setNewBlogTitle("")
        setNewBlogAuthor("")
        setNewBlogContent("")
        loadBlogPosts()
      } else {
        alert(data.error || "Failed to create blog post")
      }
    } catch (error) {
      alert("Failed to create blog post")
    } finally {
      setAddingBlog(false)
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setDeletingBlogId(blogId)
    try {
      const res = await fetch(`/api/admin/blog/${blogId}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        loadBlogPosts()
      } else {
        alert(data.error || "Failed to delete blog post")
      }
    } catch (error) {
      alert("Failed to delete blog post")
    } finally {
      setDeletingBlogId(null)
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white/80">Loading...</p>
        </div>
      </main>
    )
  }

  if (user?.role === "admin") {
    return (
      <main className="relative min-h-screen bg-background">
        <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
          <div className="absolute inset-0 bg-black/60" />
          <Navigation />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-lg text-white/80">Website Analytics & User Management</p>
          </div>
        </div>

        <section className="relative py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            {analyticsLoading ? (
              <div className="text-center py-12">
                <p className="text-white/80">Loading analytics...</p>
              </div>
            ) : analytics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Total Views</p>
                        <p className="text-2xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Unique Visitors</p>
                        <p className="text-2xl font-bold text-white">{analytics.uniqueVisitors.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Avg. Duration</p>
                        <p className="text-2xl font-bold text-white">{analytics.avgDuration}s</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Top Pages</p>
                        <p className="text-2xl font-bold text-white">{analytics.topPages.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Top Pages</h3>
                    <div className="space-y-3">
                      {analytics.topPages.slice(0, 5).map((page: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80 text-sm truncate">{page.path}</span>
                          <span className="text-white font-semibold">{page.views.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Top Referrers</h3>
                    <div className="space-y-3">
                      {analytics.referrers.slice(0, 5).map((ref: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80 text-sm truncate">{ref.referrer}</span>
                          <span className="text-white font-semibold">{ref.views.toLocaleString()}</span>
                        </div>
                      ))}
                      {analytics.referrers.length === 0 && (
                        <p className="text-white/60 text-sm">No referrers found</p>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Devices</h3>
                    <div className="space-y-3">
                      {analytics.devices.map((device: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80 text-sm capitalize">{device.device || "Unknown"}</span>
                          <span className="text-white font-semibold">{device.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="glass-dark rounded-2xl p-6 border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Browsers</h3>
                    <div className="space-y-3">
                      {analytics.browsers.map((browser: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/80 text-sm">{browser.browser || "Unknown"}</span>
                          <span className="text-white font-semibold">{browser.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </>
            ) : null}

            <Card className="glass-dark rounded-2xl p-6 border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Management</h3>
                <Button
                  onClick={() => {
                    const form = document.getElementById("add-user-form")
                    if (form) {
                      (form as HTMLFormElement).scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  size="sm"
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <form id="add-user-form" onSubmit={handleAddUser} className="mb-6 p-4 bg-white/5 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="text"
                    placeholder="Name (optional)"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addingUser}
                  className="bg-white text-black hover:bg-white/90"
                >
                  {addingUser ? "Adding..." : "Add Client User"}
                </Button>
              </form>

              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{u.name || u.email}</p>
                      <p className="text-white/60 text-sm">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm capitalize">
                        {u.role}
                      </span>
                      {u.id !== user?.id && (
                        <Button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={deletingUserId === u.id}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-dark rounded-2xl p-6 border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Blog Management</h3>
                <Button
                  onClick={() => {
                    const form = document.getElementById("add-blog-form")
                    if (form) {
                      (form as HTMLFormElement).scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  size="sm"
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>

              <form id="add-blog-form" onSubmit={handleAddBlog} className="mb-6 p-4 bg-white/5 rounded-lg space-y-3">
                <Input
                  type="text"
                  placeholder="Endpoint (e.g., example-article)"
                  value={newBlogSlug}
                  onChange={(e) => setNewBlogSlug(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  type="text"
                  placeholder="Article Title"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  type="text"
                  placeholder="Author Name"
                  value={newBlogAuthor}
                  onChange={(e) => setNewBlogAuthor(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <div>
                  <label className="text-sm text-white/80 mb-2 block">Article Content</label>
                  <RichTextEditor
                    value={newBlogContent}
                    onChange={setNewBlogContent}
                    placeholder="Start writing your article..."
                  />
                  <p className="text-xs text-white/50 mt-2">
                    Select text and use the toolbar buttons to format (bold, italic, headings, font size, colors, etc.)
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={addingBlog}
                  className="bg-white text-black hover:bg-white/90"
                >
                  {addingBlog ? "Creating..." : "Create Blog Post"}
                </Button>
              </form>

              <div className="space-y-2">
                {blogPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-white/60 text-sm">/{post.slug} • By {post.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteBlog(post.id)}
                        disabled={deletingBlogId === post.id}
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && (
                  <p className="text-white/60 text-sm text-center py-4">No blog posts yet</p>
                )}
              </div>
            </Card>

            <div className="flex justify-center">
              <form action="/api/auth/logout" method="POST">
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[300px] w-full overflow-hidden flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 bg-black/60" />
        <Navigation />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Client Dashboard</h1>
          {user ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <p className="text-lg text-white/80">
                Welcome, <span className="font-semibold text-white">{user.name || user.email}</span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-white/80">Manage your projects and account</p>
          )}
        </div>
      </div>

      <section className="relative py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Projects</h3>
                  <p className="text-white/60 text-sm">View your active projects</p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Invoices</h3>
                  <p className="text-white/60 text-sm">View and pay invoices</p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Schedule</h3>
                  <p className="text-white/60 text-sm">View upcoming meetings</p>
                </div>
              </div>
            </Card>

            <Link href="/client-portal/analytics/reddit">
              <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Reddit Ads</h3>
                    <p className="text-white/60 text-sm">View Reddit advertising analytics</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/client-portal/integrations/reddit">
              <Card className="glass-dark rounded-2xl p-6 border-white/10 hover:border-white/20 transition-colors cursor-pointer border-dashed">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Add Integration</h3>
                    <p className="text-white/60 text-sm">Connect Reddit Ads account</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="glass-dark rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {user ? `Welcome back, ${user.name || user.email}` : "Welcome to your dashboard"}
                  </p>
                  <p className="text-white/60 text-sm">
                    {user ? `Signed in as ${user.email}` : "Your account is set up and ready to use"}
                  </p>
                </div>
                <span className="text-white/40 text-sm">Just now</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <form action="/api/auth/logout" method="POST">
              <Button
                type="submit"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

