import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Count members by designation
    const byDesignation = await db.partyMember.groupBy({
      by: ['designation'],
      _count: { id: true }
    })

    // Count members by state
    const byState = await db.partyMember.groupBy({
      by: ['state'],
      where: {
        state: { not: '' }
      },
      _count: { id: true }
    })

    return NextResponse.json({
      byDesignation: byDesignation.map(d => ({ designation: d.designation, count: d._count.id })),
      byState: byState.map(s => ({ state: s.state, count: s._count.id }))
    })
  } catch (error) {
    console.error('Hierarchy count error:', error)
    return NextResponse.json({ error: 'Failed to compute hierarchy stats' }, { status: 500 })
  }
}
