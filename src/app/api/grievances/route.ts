import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.citizenName || !body.citizenPhone || !body.subject) {
      return NextResponse.json({ error: 'Name, phone, and subject required' }, { status: 400 })
    }
    const grievance = await db.grievance.create({ data: body })
    return NextResponse.json(grievance, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit grievance' }, { status: 500 })
  }
}

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const grievances = await db.grievance.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(grievances)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
