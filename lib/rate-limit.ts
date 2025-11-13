import { db } from "@/lib/db"

export async function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const attempts = await db.loginCode.count({
    where: {
      email: identifier,
      createdAt: {
        gte: windowStart,
      },
    },
  })

  const remaining = Math.max(0, maxAttempts - attempts)
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)

  return {
    allowed: attempts < maxAttempts,
    remaining,
    resetAt,
  }
}

export async function checkVerificationRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const recentCodes = await db.loginCode.findMany({
    where: {
      email: identifier,
      createdAt: {
        gte: windowStart,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const failedAttempts = recentCodes.filter((code) => code.used === false && code.expiresAt < new Date()).length
  const attempts = recentCodes.length

  const remaining = Math.max(0, maxAttempts - attempts)
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)

  return {
    allowed: attempts < maxAttempts,
    remaining,
    resetAt,
  }
}

