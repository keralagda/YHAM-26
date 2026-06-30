import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }

    const media = await db.media.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching public media:', error)
    return NextResponse.json({ error: 'Failed to retrieve media assets' }, { status: 500 })
  }
}
