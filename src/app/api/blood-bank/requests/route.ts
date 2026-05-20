import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.patientName || !body.contactPhone) {
      return NextResponse.json({ error: 'Patient name and contact required' }, { status: 400 })
    }
    const req = await db.bloodRequest.create({ data: { ...body, units: parseInt(body.units) || 1 } })
    return NextResponse.json(req, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const requests = await db.bloodRequest.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(requests)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
