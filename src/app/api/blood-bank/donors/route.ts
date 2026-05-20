import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.fullName || !body.phone || !body.bloodGroup) {
      return NextResponse.json({ error: 'Name, phone, and blood group required' }, { status: 400 })
    }
    const donor = await db.bloodDonor.create({ data: body })
    return NextResponse.json(donor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register donor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const donors = await db.bloodDonor.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(donors)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
