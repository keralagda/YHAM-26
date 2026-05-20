import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bloodGroup = searchParams.get('bloodGroup')
    const city = searchParams.get('city')

    if (!bloodGroup) return NextResponse.json({ error: 'bloodGroup required' }, { status: 400 })

    const where: any = { bloodGroup, available: true }
    if (city) where.city = { contains: city, mode: 'insensitive' }

    const donors = await db.bloodDonor.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 })
    return NextResponse.json(donors)
  } catch { return NextResponse.json({ error: 'Search failed' }, { status: 500 }) }
}
