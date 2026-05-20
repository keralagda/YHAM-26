import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

const ALLOWED_FIELDS = ['isRead']

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

    const submission = await db.contactSubmission.update({
      where: { id },
      data,
    })
    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.contactSubmission.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}
