import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const event = await db.partyEvent.create({ data: body })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const events = await db.partyEvent.findMany({ orderBy: { date: 'desc' } })
    return NextResponse.json(events)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
