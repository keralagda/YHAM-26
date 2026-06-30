import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyMemberSession } from '@/lib/member-auth'

export async function GET() {
  try {
    const session = await verifyMemberSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const member = await db.partyMember.findUnique({
      where: { id: session.id }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member profile not found' }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}
