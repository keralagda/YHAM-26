import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if any user exists, if not create default admin
    let user = await db.user.findFirst()
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      user = await db.user.create({
        data: {
          email: 'admin@yham.org',
          name: 'YHAM Admin',
          password: hashedPassword,
          role: 'admin',
        },
      })
    }

    // Verify credentials
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid || user.email !== email) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create database-backed session
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
  // Logout: clear cookie
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
