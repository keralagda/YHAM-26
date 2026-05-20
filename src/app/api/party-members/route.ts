import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

// Public - anyone can submit membership application
export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.fullName || !body.phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }
    const member = await db.partyMember.create({ data: body })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating party member:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

// Admin - list all members
export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const members = await db.partyMember.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
