import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const integration = await db.apiIntegration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "reddit",
        },
      },
      select: {
        id: true,
        provider: true,
        clientId: true,
        accountId: true,
        refreshToken: true, // Include to check if authorized
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ integration }, { status: 200 })
  } catch (error) {
    console.error("Error fetching integration:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { clientId, clientSecret, accountId } = body

    if (!clientId || !clientId.trim()) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      )
    }

    const existing = await db.apiIntegration.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "reddit",
        },
      },
    })

    if (existing) {
      const integration = await db.apiIntegration.update({
        where: {
          userId_provider: {
            userId: user.id,
            provider: "reddit",
          },
        },
        data: {
          clientId: clientId.trim(),
          clientSecret: clientSecret && clientSecret.trim() ? clientSecret.trim() : existing.clientSecret,
          accountId: accountId && accountId.trim() ? accountId.trim() : null,
        },
      })

      return NextResponse.json(
        { message: "Reddit integration updated successfully", integration: { id: integration.id, provider: integration.provider } },
        { status: 200 }
      )
    } else {
      if (!clientSecret || !clientSecret.trim()) {
        return NextResponse.json(
          { error: "Client Secret is required for new integrations" },
          { status: 400 }
        )
      }

      const integration = await db.apiIntegration.create({
        data: {
          userId: user.id,
          provider: "reddit",
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          accountId: accountId && accountId.trim() ? accountId.trim() : null,
        },
      })

      return NextResponse.json(
        { message: "Reddit integration saved successfully", integration: { id: integration.id, provider: integration.provider } },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error saving integration:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "An error occurred", details: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    await db.apiIntegration.deleteMany({
      where: {
        userId: user.id,
        provider: "reddit",
      },
    })

    return NextResponse.json(
      { message: "Reddit integration removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting integration:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

