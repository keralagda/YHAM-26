import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.donorName || !body.amount) {
      return NextResponse.json({ error: 'Donor name and amount required' }, { status: 400 })
    }
    const donation = await db.donation.create({ data: { ...body, amount: parseFloat(body.amount) } })
    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
  }
}

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const donations = await db.donation.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(donations)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
