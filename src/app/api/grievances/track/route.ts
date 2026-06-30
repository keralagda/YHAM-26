import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketNo = searchParams.get('ticketNo')

    if (!ticketNo) {
      return NextResponse.json({ error: 'Ticket number required' }, { status: 400 })
    }

    const grievance = await db.grievance.findUnique({
      where: { ticketNo },
    })

    if (!grievance) {
      return NextResponse.json({ error: 'Grievance not found' }, { status: 404 })
    }

    return NextResponse.json(grievance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track grievance' }, { status: 500 })
  }
}
