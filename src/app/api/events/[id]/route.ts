import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const allowed = ['title','description','eventType','date','time','venue','city','district','state','expectedCrowd','actualCrowd','chiefGuest','organizer','status','streamUrl','notes']
    const data: Record<string, unknown> = {}
    for (const key of allowed) { if (body[key] !== undefined) data[key] = body[key] }
    const event = await db.partyEvent.update({ where: { id }, data })
    return NextResponse.json(event)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await db.partyEvent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
