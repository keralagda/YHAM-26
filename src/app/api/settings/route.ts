import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const settings = await db.siteSetting.findMany({
      orderBy: { key: 'asc' },
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()

    let entries: [string, string][] = []

    if (body.settings && Array.isArray(body.settings)) {
      entries = body.settings.map((s: { key: string; value: string }) => [s.key, String(s.value)])
    } else {
      const { settings: _, ...rest } = body
      entries = Object.entries(rest).map(([key, value]) => [key, String(value)])
    }

    const updates = entries.map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    await Promise.all(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
