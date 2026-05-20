import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventType, page, metadata, userAgent } = body

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
    }

    await db.analyticsEvent.create({
      data: {
        eventType,
        page: page || '/',
        metadata: metadata ? JSON.stringify(metadata) : '{}',
        userAgent: userAgent || '',
        ip: '',
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
