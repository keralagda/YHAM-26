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

// Admin - update member status
export async function PUT(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, status, designation, notes } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const data: Record<string, unknown> = {}
    if (status) data.status = status
    if (designation) data.designation = designation
    if (notes !== undefined) data.notes = notes
    if (status === 'verified') data.verifiedAt = new Date()
    const member = await db.partyMember.update({ where: { id }, data })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
