import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { nameHi, nameEn, nameMl, roleHi, roleEn, roleMl, phone, email, imageUrl, category, order, visible } = body

    if (!nameHi || !nameEn || !nameMl || !roleHi || !roleEn || !roleMl) {
      return NextResponse.json({ error: 'Names and roles in all languages are required' }, { status: 400 })
    }

    const member = await db.member.create({
      data: {
        nameHi, nameEn, nameMl,
        roleHi, roleEn, roleMl,
        phone: phone || '',
        email: email || '',
        imageUrl: imageUrl || '',
        category: category || 'yham',
        order: order ?? 0,
        visible: visible ?? true,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { members } = body as { members: { id: string; order: number; visible: boolean }[] }

    if (!members || !Array.isArray(members)) {
      return NextResponse.json({ error: 'members array is required' }, { status: 400 })
    }

    const updates = members.map((m) =>
      db.member.update({
        where: { id: m.id },
        data: { order: m.order, visible: m.visible },
      })
    )

    await Promise.all(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating members order:', error)
    return NextResponse.json({ error: 'Failed to update members' }, { status: 500 })
  }
}
