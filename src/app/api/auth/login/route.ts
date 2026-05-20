import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple session store (in-memory for demo; use proper auth in production)
const sessions = new Map<string, { userId: string; email: string; role: string; expiresAt: number }>()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if any user exists, if not create default admin
    let user = await db.user.findFirst()
    if (!user) {
      // Create default admin user (password: admin123)
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      user = await db.user.create({
        data: {
          email: 'admin@yham.org',
          name: 'YHAM Admin',
          password: hashedPassword,
          role: 'admin',
        },
      })
    }

    // Verify password
    const bcrypt = await import('bcryptjs')
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid || user.email !== email) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session token
    const token = crypto.randomUUID()
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}

// Export sessions for verification in other routes
export { sessions }
