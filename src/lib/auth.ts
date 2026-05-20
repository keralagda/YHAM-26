import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
}

/**
 * Verify the admin session token from cookies.
 * Returns the user if valid, null otherwise.
 */
export async function verifySession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) return null

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) return null
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await db.session.delete({ where: { id: session.id } }).catch(() => {})
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    }
  } catch {
    return null
  }
}

/**
 * Require authentication. Returns user or throws a Response.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await verifySession()
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return user
}
