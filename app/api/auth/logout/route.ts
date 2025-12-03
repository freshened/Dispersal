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

    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const ngrokUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null
    
    const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dispersal.net"
    
    const baseUrl = envBaseUrl || ngrokUrl || request.nextUrl.origin

    const response = NextResponse.redirect(new URL("/client-portal", baseUrl))
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    const forwardedHost = request.headers.get("x-forwarded-host")
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
    const ngrokUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : null
    
    const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dispersal.net"
    
    const baseUrl = envBaseUrl || ngrokUrl || request.nextUrl.origin
    
    const response = NextResponse.redirect(new URL("/client-portal", baseUrl))
    response.cookies.delete("session_token")
    return response
  }
}

