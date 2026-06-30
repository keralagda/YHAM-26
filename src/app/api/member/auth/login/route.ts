import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { phone, secret } = await request.json()

    if (!phone || !secret) {
      return NextResponse.json({ error: 'Phone number and verification secret required' }, { status: 400 })
    }

    // Find member matching phone and either aadharLast4 or voterIdNumber
    const member = await db.partyMember.findFirst({
      where: {
        phone,
        OR: [
          { aadharLast4: secret },
          { voterIdNumber: secret }
        ]
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Invalid login credentials. Please ensure your registered phone and Aadhar/Voter ID are correct.' }, { status: 401 })
    }

    // Set secure member session token cookie
    const cookieStore = await cookies()
    cookieStore.set('member_token', member.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        phone: member.phone,
        designation: member.designation,
        status: member.status
      }
    })
  } catch (error) {
    console.error('Member login error:', error)
    return NextResponse.json({ error: 'Failed to process login authentication' }, { status: 500 })
  }
}
