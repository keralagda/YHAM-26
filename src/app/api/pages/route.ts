import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: { order: 'asc' },
      include: { blocks: { orderBy: { order: 'asc' } } },
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { slug, titleHi, titleEn, titleMl, description, template, theme } = body

    if (!slug || !titleEn) {
      return NextResponse.json({ error: 'slug and titleEn are required' }, { status: 400 })
    }

    const page = await db.page.create({
      data: {
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        titleHi: titleHi || titleEn,
        titleEn,
        titleMl: titleMl || titleEn,
        description: description || '',
        template: template || 'default',
        theme: theme || 'saffron',
        order: 0,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error && error.message.includes('Unique')
      ? 'A page with this slug already exists'
      : 'Failed to create page'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
