const codes = new Map<string, { code: string; expiresAt: number }>()

export function storeCode(email: string, code: string, expiresInMinutes: number = 10) {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000
  codes.set(email.toLowerCase(), { code, expiresAt })
}

export function getCode(email: string): { code: string; expiresAt: number } | undefined {
  return codes.get(email.toLowerCase())
}

export function deleteCode(email: string) {
  codes.delete(email.toLowerCase())
}

export function cleanupExpiredCodes() {
  const now = Date.now()
  for (const [email, data] of codes.entries()) {
    if (data.expiresAt < now) {
      codes.delete(email)
    }
  }
}

setInterval(cleanupExpiredCodes, 60000)

