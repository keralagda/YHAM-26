import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { pageId, type, order, content, settings } = body

    if (!pageId || !type) {
      return NextResponse.json({ error: 'pageId and type are required' }, { status: 400 })
    }

    const block = await db.block.create({
      data: {
        pageId,
        type,
        order: order ?? 0,
        content: content ? JSON.stringify(content) : '{}',
        settings: settings ? JSON.stringify(settings) : '{}',
      },
    })

    return NextResponse.json(block, { status: 201 })
  } catch (error) {
    console.error('Error creating block:', error)
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 })
  }
}

// Bulk reorder blocks
export async function PUT(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { blocks } = await request.json() as { blocks: { id: string; order: number; visible: boolean }[] }
    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ error: 'blocks array required' }, { status: 400 })
    }

    await Promise.all(
      blocks.map((b) => db.block.update({ where: { id: b.id }, data: { order: b.order, visible: b.visible } }))
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering blocks:', error)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }
}
