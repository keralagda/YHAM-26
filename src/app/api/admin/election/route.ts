import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

const DEFAULT_BOOTHS = [
  { boothNumber: 'BP-101', boothName: 'Gaya Town Central School', assemblySector: 'Gaya Assembly - Sector 1', totalVoters: 1200, outreachPercent: 88.5, voterSupport: 680, voterOppose: 320, voterNeutral: 200, turnoutPercent: 0.0 },
  { boothNumber: 'BP-102', boothName: 'Patna Town Hall Hall A', assemblySector: 'Patna Assembly - Sector 3', totalVoters: 1550, outreachPercent: 74.0, voterSupport: 890, voterOppose: 410, voterNeutral: 250, turnoutPercent: 0.0 },
  { boothNumber: 'BP-103', boothName: 'Muzaffarpur Govt Library', assemblySector: 'Muzaffarpur Assembly - Sector 2', totalVoters: 950, outreachPercent: 92.0, voterSupport: 520, voterOppose: 290, voterNeutral: 140, turnoutPercent: 0.0 },
  { boothNumber: 'BP-104', boothName: 'Bhagalpur Railway Colony School', assemblySector: 'Bhagalpur Assembly - Sector 5', totalVoters: 1400, outreachPercent: 61.5, voterSupport: 610, voterOppose: 540, voterNeutral: 250, turnoutPercent: 0.0 },
  { boothNumber: 'BP-105', boothName: 'Darbhanga Sanskrit College Bld', assemblySector: 'Darbhanga Assembly - Sector 4', totalVoters: 1100, outreachPercent: 80.0, voterSupport: 630, voterOppose: 310, voterNeutral: 160, turnoutPercent: 0.0 },
]

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let booths = await db.boothPerformance.findMany({
      orderBy: { boothNumber: 'asc' }
    })

    // Auto-seed default booths if table is empty
    if (booths.length === 0) {
      await db.boothPerformance.createMany({
        data: DEFAULT_BOOTHS
      })
      booths = await db.boothPerformance.findMany({
        orderBy: { boothNumber: 'asc' }
      })
    }

    return NextResponse.json(booths)
  } catch (error) {
    console.error('Error fetching election stats:', error)
    return NextResponse.json({ error: 'Failed to retrieve election data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { action, id, turnoutPercent } = body

    if (action === 'seed') {
      await db.boothPerformance.deleteMany({})
      await db.boothPerformance.createMany({ data: DEFAULT_BOOTHS })
      const booths = await db.boothPerformance.findMany({ orderBy: { boothNumber: 'asc' } })
      return NextResponse.json(booths)
    }

    if (!id || turnoutPercent === undefined) {
      return NextResponse.json({ error: 'ID and turnout percent required' }, { status: 400 })
    }

    const updated = await db.boothPerformance.update({
      where: { id },
      data: { turnoutPercent: parseFloat(turnoutPercent) }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating turnout:', error)
    return NextResponse.json({ error: 'Failed to update election metrics' }, { status: 500 })
  }
}
