import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (sessionToken) {
      await db.session.deleteMany({
        where: { token: sessionToken },
      })
    }

    const response = NextResponse.redirect(new URL("/client-portal", request.url))
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    const response = NextResponse.redirect(new URL("/client-portal", request.url))
    response.cookies.delete("session_token")
    return response
  }
}

