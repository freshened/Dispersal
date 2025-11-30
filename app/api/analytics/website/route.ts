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

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [totalViews, uniqueVisitors, topPages, referrers, devices, browsers, avgDuration] = await Promise.all([
      db.pageView.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      db.pageView.groupBy({
        by: ["sessionId"],
        where: {
          createdAt: {
            gte: startDate,
          },
          sessionId: {
            not: null,
          },
        },
      }).then((result) => result.length),
      db.pageView.groupBy({
        by: ["path"],
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _count: {
          path: true,
        },
        orderBy: {
          _count: {
            path: "desc",
          },
        },
        take: 10,
      }),
      db.pageView.groupBy({
        by: ["referrer"],
        where: {
          createdAt: {
            gte: startDate,
          },
          referrer: {
            not: null,
          },
        },
        _count: {
          referrer: true,
        },
        orderBy: {
          _count: {
            referrer: "desc",
          },
        },
        take: 10,
      }),
      db.pageView.groupBy({
        by: ["deviceType"],
        where: {
          createdAt: {
            gte: startDate,
          },
          deviceType: {
            not: null,
          },
        },
        _count: {
          deviceType: true,
        },
      }),
      db.pageView.groupBy({
        by: ["browser"],
        where: {
          createdAt: {
            gte: startDate,
          },
          browser: {
            not: null,
          },
        },
        _count: {
          browser: true,
        },
      }),
      db.pageView.aggregate({
        where: {
          createdAt: {
            gte: startDate,
          },
          duration: {
            not: null,
          },
        },
        _avg: {
          duration: true,
        },
      }),
    ])

    const allViews = await db.pageView.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    })

    const dailyViewsMap = new Map<string, number>()
    allViews.forEach((view) => {
      const date = view.createdAt.toISOString().split("T")[0]
      dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1)
    })

    const dailyViews = Array.from(dailyViewsMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      topPages: topPages.map((p) => ({
        path: p.path,
        views: p._count.path,
      })),
      referrers: referrers
        .filter((r) => r.referrer && !r.referrer.includes(request.nextUrl.hostname))
        .map((r) => ({
          referrer: r.referrer,
          views: r._count.referrer,
        })),
      devices: devices.map((d) => ({
        device: d.deviceType,
        count: d._count.deviceType,
      })),
      browsers: browsers.map((b) => ({
        browser: b.browser,
        count: b._count.browser,
      })),
      avgDuration: avgDuration._avg.duration ? Math.round(avgDuration._avg.duration / 1000) : 0,
      dailyViews,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

