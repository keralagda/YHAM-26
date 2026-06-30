import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const leaderboard = await db.partyMember.findMany({
      where: {
        status: { in: ['verified', 'active'] }
      },
      select: {
        id: true,
        fullName: true,
        kpiScore: true,
        designation: true,
        state: true
      },
      orderBy: {
        kpiScore: 'desc'
      },
      take: 10
    })

    return NextResponse.json(leaderboard)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
