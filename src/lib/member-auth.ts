import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export interface SessionMember {
  id: string
  fullName: string
  phone: string
  designation: string
  status: string
  digitalIdUrl: string
}

/**
 * Retrieve the active member session from the cookie store.
 */
export async function verifyMemberSession(): Promise<SessionMember | null> {
  try {
    const cookieStore = await cookies()
    const memberId = cookieStore.get('member_token')?.value

    if (!memberId) return null

    const member = await db.partyMember.findUnique({
      where: { id: memberId },
    })

    if (!member) return null

    return {
      id: member.id,
      fullName: member.fullName,
      phone: member.phone,
      designation: member.designation,
      status: member.status,
      digitalIdUrl: member.digitalIdUrl,
    }
  } catch {
    return null
  }
}
