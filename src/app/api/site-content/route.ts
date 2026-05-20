import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const sections = await db.siteSection.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching site sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sectionKey, label, order, visible, sectionType, contentHi, contentEn, contentMl } = body

    if (!sectionKey || !label) {
      return NextResponse.json({ error: 'sectionKey and label are required' }, { status: 400 })
    }

    const section = await db.siteSection.create({
      data: {
        sectionKey,
        label,
        order: order ?? 0,
        visible: visible ?? true,
        sectionType: sectionType ?? 'content',
        contentHi: contentHi ? JSON.stringify(contentHi) : '{}',
        contentEn: contentEn ? JSON.stringify(contentEn) : '{}',
        contentMl: contentMl ? JSON.stringify(contentMl) : '{}',
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating site section:', error)
    const errMsg = error instanceof Error && error.message.includes('Unique') ? 'Section key already exists' : 'Failed to create section'
    return NextResponse.json({ error: errMsg }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { sections } = body as { sections: { id: string; order: number; visible: boolean }[] }

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: 'sections array is required' }, { status: 400 })
    }

    const updates = sections.map((s) =>
      db.siteSection.update({
        where: { id: s.id },
        data: { order: s.order, visible: s.visible },
      })
    )

    await Promise.all(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating sections order:', error)
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 })
  }
}
