import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

// Whitelist of fields that can be updated
const ALLOWED_FIELDS = ['nameHi', 'nameEn', 'nameMl', 'roleHi', 'roleEn', 'roleMl', 'phone', 'email', 'imageUrl', 'category', 'order', 'visible']

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const member = await db.member.findUnique({ where: { id } })
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()

    // Only allow whitelisted fields
    const data: Record<string, unknown> = {}
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) {
        data[key] = body[key]
      }
    }

    const member = await db.member.update({
      where: { id },
      data,
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.member.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
