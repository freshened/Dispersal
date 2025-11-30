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

export async function checkContactRateLimit(
  email: string | null,
  ipAddress: string | null,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  if (!process.env.DATABASE_URL) {
    return {
      allowed: true,
      remaining: maxAttempts,
      resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
    }
  }

  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  let emailAttempts = 0
  if (email) {
    try {
      emailAttempts = await Promise.race([
        db.contactSubmission.count({
          where: {
            email: email.toLowerCase().trim(),
            createdAt: {
              gte: windowStart,
            },
          },
        }),
        new Promise<number>((resolve) => setTimeout(() => resolve(0), 1000)),
      ])
    } catch (error) {
      console.warn("Rate limit check failed (database not available), allowing request")
      return {
        allowed: true,
        remaining: maxAttempts,
        resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
      }
    }
  }

  let ipAttempts = 0
  if (ipAddress) {
    try {
      ipAttempts = await Promise.race([
        db.contactSubmission.count({
          where: {
            ipAddress,
            createdAt: {
              gte: windowStart,
            },
          },
        }),
        new Promise<number>((resolve) => setTimeout(() => resolve(0), 1000)),
      ])
    } catch (error) {
      console.warn("Rate limit check failed (database not available), allowing request")
      return {
        allowed: true,
        remaining: maxAttempts,
        resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
      }
    }
  }

  const attempts = Math.max(emailAttempts, ipAttempts)
  const remaining = Math.max(0, maxAttempts - attempts)
  const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)

  return {
    allowed: attempts < maxAttempts,
    remaining,
    resetAt,
  }
}

export async function checkIPRateLimit(
  ipAddress: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const attempts = await db.loginCode.count({
    where: {
      ipAddress,
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

export async function checkIPVerificationRateLimit(
  ipAddress: string,
  maxAttempts: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const attempts = await db.loginCode.count({
    where: {
      ipAddress,
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

