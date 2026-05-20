import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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
  try {
    const body = await request.json()

    // Support two formats:
    // 1. { key: value, ... } - plain object
    // 2. { settings: [{ key, value }, ...] } - array format from admin UI
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
