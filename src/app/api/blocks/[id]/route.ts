import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const data: Record<string, unknown> = {}

    if (body.type !== undefined) data.type = body.type
    if (body.order !== undefined) data.order = body.order
    if (body.visible !== undefined) data.visible = body.visible
    if (body.content !== undefined) data.content = typeof body.content === 'string' ? body.content : JSON.stringify(body.content)
    if (body.settings !== undefined) data.settings = typeof body.settings === 'string' ? body.settings : JSON.stringify(body.settings)

    const block = await db.block.update({ where: { id }, data })
    return NextResponse.json(block)
  } catch (error) {
    console.error('Error updating block:', error)
    return NextResponse.json({ error: 'Failed to update block' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await db.block.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting block:', error)
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 })
  }
}
