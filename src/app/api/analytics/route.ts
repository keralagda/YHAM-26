import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Total page views
    const totalViews = await db.analyticsEvent.count({
      where: { eventType: 'page_view' },
    })

    // Today's views
    const todayViews = await db.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        createdAt: { gte: today },
      },
    })

    // Last 7 days views
    const weekViews = await db.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        createdAt: { gte: sevenDaysAgo },
      },
    })

    // Last 30 days views
    const monthViews = await db.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    // Daily views for last 30 days
    const dailyViews = await db.analyticsEvent.findMany({
      where: {
        eventType: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    })

    // Group by day → array format for recharts
    const viewsByDayMap: Record<string, number> = {}
    dailyViews.forEach((event) => {
      const day = new Date(event.createdAt).toISOString().split('T')[0]
      viewsByDayMap[day] = (viewsByDayMap[day] || 0) + 1
    })
    const viewsByDay = Object.entries(viewsByDayMap)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Section views breakdown → array format for recharts
    const sectionViews = await db.analyticsEvent.findMany({
      where: { eventType: 'section_view' },
      select: { metadata: true },
    })
    const sectionMap: Record<string, number> = {}
    sectionViews.forEach((event) => {
      try {
        const meta = JSON.parse(event.metadata)
        const section = meta.section || 'unknown'
        sectionMap[section] = (sectionMap[section] || 0) + 1
      } catch { /* ignore */ }
    })
    const sectionBreakdown = Object.entries(sectionMap)
      .map(([section, views]) => ({ section, views }))
      .sort((a, b) => b.views - a.views)

    // Language changes → array format for recharts
    const languageEvents = await db.analyticsEvent.findMany({
      where: { eventType: 'language_change' },
      select: { metadata: true },
    })
    const languageMap: Record<string, number> = {}
    languageEvents.forEach((event) => {
      try {
        const meta = JSON.parse(event.metadata)
        const lang = meta.language || 'unknown'
        languageMap[lang] = (languageMap[lang] || 0) + 1
      } catch { /* ignore */ }
    })
    const languageBreakdown = Object.entries(languageMap)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)

    // Contact clicks
    const contactClicks = await db.analyticsEvent.count({
      where: { eventType: 'contact_click' },
    })

    return NextResponse.json({
      totalViews,
      todayViews,
      weekViews,
      monthViews,
      viewsByDay,
      sectionBreakdown,
      languageBreakdown,
      contactClicks,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
