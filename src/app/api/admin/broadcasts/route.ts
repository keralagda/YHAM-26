import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const campaigns = await db.broadcastCampaign.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, message, channel, targetGroup, stateFilter } = await request.json()

    if (!title || !message || !channel || !targetGroup) {
      return NextResponse.json({ error: 'Title, message, channel, and target group required' }, { status: 400 })
    }

    // Resolve matching cadre headcount for simulation
    const where: any = {
      status: { in: ['verified', 'active'] }
    }
    if (targetGroup !== 'all') {
      where.designation = targetGroup
    }
    if (stateFilter) {
      where.state = stateFilter
    }

    const sentCount = await db.partyMember.count({ where })

    const campaign = await db.broadcastCampaign.create({
      data: {
        title,
        message,
        channel,
        targetGroup,
        stateFilter: stateFilter || '',
        sentCount,
        status: 'sent'
      }
    })

    // Track analytics log for broadcast execution
    try {
      await db.analyticsEvent.create({
        data: {
          eventType: 'broadcast_sent',
          page: '/admin',
          metadata: JSON.stringify({
            campaignId: campaign.id,
            channel,
            targetGroup,
            sentCount
          })
        }
      })
    } catch { /* Ignore logging issues */ }

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Broadcast campaign creation error:', error)
    return NextResponse.json({ error: 'Failed to process broadcast campaign' }, { status: 500 })
  }
}
