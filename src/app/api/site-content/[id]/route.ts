import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const section = await db.siteSection.findUnique({ where: { id } })
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { label, order, visible, sectionType, contentHi, contentEn, contentMl } = body

    const data: Record<string, unknown> = {}
    if (label !== undefined) data.label = label
    if (order !== undefined) data.order = order
    if (visible !== undefined) data.visible = visible
    if (sectionType !== undefined) data.sectionType = sectionType
    if (contentHi !== undefined) data.contentHi = typeof contentHi === 'string' ? contentHi : JSON.stringify(contentHi)
    if (contentEn !== undefined) data.contentEn = typeof contentEn === 'string' ? contentEn : JSON.stringify(contentEn)
    if (contentMl !== undefined) data.contentMl = typeof contentMl === 'string' ? contentMl : JSON.stringify(contentMl)

    const section = await db.siteSection.update({
      where: { id },
      data,
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.siteSection.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}
