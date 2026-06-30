import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyMemberSession } from '@/lib/member-auth'

export async function POST(request: Request) {
  try {
    const session = await verifyMemberSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { houses, recruits, events } = await request.json()

    const housesCount = parseInt(houses) || 0
    const recruitsCount = parseInt(recruits) || 0
    const eventsCount = parseInt(events) || 0

    if (housesCount < 0 || recruitsCount < 0 || eventsCount < 0) {
      return NextResponse.json({ error: 'Values must be non-negative' }, { status: 400 })
    }

    const currentMember = await db.partyMember.findUnique({
      where: { id: session.id }
    })

    if (!currentMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const newHousesVisited = currentMember.housesVisited + housesCount
    const newMembersRecruited = currentMember.membersRecruited + recruitsCount
    const newEventsAttended = currentMember.eventsAttended + eventsCount

    // KPI Score formula: 2 points per house, 10 points per recruit, 5 points per event
    const newKpiScore = (newHousesVisited * 2) + (newMembersRecruited * 10) + (newEventsAttended * 5)

    const updatedMember = await db.partyMember.update({
      where: { id: session.id },
      data: {
        housesVisited: newHousesVisited,
        membersRecruited: newMembersRecruited,
        eventsAttended: newEventsAttended,
        kpiScore: newKpiScore
      }
    })

    // Track activity in event log/analytics for accountability
    try {
      await db.analyticsEvent.create({
        data: {
          eventType: 'kpi_report',
          page: '/member',
          metadata: JSON.stringify({
            memberId: session.id,
            memberName: session.fullName,
            reported: { houses: housesCount, recruits: recruitsCount, events: eventsCount },
            totals: { houses: newHousesVisited, recruits: newMembersRecruited, events: newEventsAttended }
          })
        }
      })
    } catch { /* Ignore logging issues */ }

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error('KPI update error:', error)
    return NextResponse.json({ error: 'Failed to record activity log' }, { status: 500 })
  }
}
