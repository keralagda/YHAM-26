import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple auth verification helper
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // For simplicity, just check if the token exists
    // In production, verify against proper session store
    return NextResponse.json({
      authenticated: true,
      user: { email: 'admin@yham.org', name: 'YHAM Admin', role: 'admin' },
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
