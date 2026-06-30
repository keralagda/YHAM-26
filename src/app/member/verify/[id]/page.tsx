import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { CheckCircle2, ShieldAlert, Award, Star, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface VerifyPageProps {
  params: Promise<{ id: string }>
}

export default async function VerifyMemberPage({ params }: VerifyPageProps) {
  const { id } = await params
  
  const member = await db.partyMember.findUnique({
    where: { id }
  })

  if (!member) {
    notFound()
  }

  const isVerified = member.status === 'verified' || member.status === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-t-4 border-t-[#138808] overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 p-6 text-center border-b">
          <div className="size-24 rounded-full border-4 border-white bg-gray-200 mx-auto overflow-hidden shadow-lg mb-3">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.fullName} className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-gradient-to-br from-[#FF9933] to-[#000080] text-white font-bold text-3xl">
                {member.fullName.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{member.fullName}</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">ID: {member.id.slice(0, 10).toUpperCase()}</p>
          <Badge variant="outline" className="mt-2 capitalize">{member.designation.replace('_', ' ')}</Badge>
        </div>

        <CardContent className="p-6 space-y-6">
          {isVerified ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-2">
              <CheckCircle2 className="size-8 text-green-600 mx-auto" />
              <h2 className="text-lg font-bold text-green-800">Verified YHAM Cadre</h2>
              <p className="text-xs text-green-600">This member is active and verified under Youth Hindustani Awam Morcha registers.</p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center space-y-2">
              <ShieldAlert className="size-8 text-yellow-600 mx-auto" />
              <h2 className="text-lg font-bold text-yellow-800">Pending Verification</h2>
              <p className="text-xs text-yellow-600">This membership application is registered but currently pending official validation.</p>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">State / Region:</span>
              <span className="font-semibold text-gray-900">{member.state || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">District:</span>
              <span className="font-semibold text-gray-900">{member.district || 'N/A'}</span>
            </div>
            {member.panchayat && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Panchayat / Local Body:</span>
                <span className="font-semibold text-gray-900">{member.panchayat}</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Joined On:</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="size-3.5 text-gray-400" />
                {new Date(member.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">KPI Performance Score:</span>
              <span className="font-bold text-green-600 flex items-center gap-1">
                <Star className="size-3.5 fill-green-500 text-green-500" />
                {member.kpiScore} pts
              </span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link href="/">
              <Button style={{ backgroundColor: '#000080', color: '#fff' }} className="w-full">
                Visit YHAM Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
