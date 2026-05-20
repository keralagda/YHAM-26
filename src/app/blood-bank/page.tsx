'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, Phone, MapPin, Loader2, ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

export default function BloodBankPage() {
  const [tab, setTab] = useState('search')
  const [donors, setDonors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchGroup, setSearchGroup] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', bloodGroup: '', dob: '', gender: '', weight: '', state: '', district: '', city: '', pincode: '', address: '' })

  const searchDonors = async () => {
    if (!searchGroup) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ bloodGroup: searchGroup, ...(searchCity && { city: searchCity }) })
      const res = await fetch(`/api/blood-bank/search?${params}`)
      if (res.ok) setDonors(await res.json())
    } catch { /* */ }
    finally { setLoading(false) }
  }

  const handleRegister = async () => {
    if (!form.fullName || !form.phone || !form.bloodGroup) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/blood-bank/donors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setSubmitted(true)
    } catch { /* */ }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="size-6 text-red-600" />
            <span className="font-bold text-red-700">YHAM Blood Bank</span>
          </Link>
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="size-4 mr-1" /> Home</Button></Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🩸 Blood Bank</h1>
          <p className="text-gray-500 mt-2">Find blood donors or register as a donor</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="search" className="flex-1">🔍 Find Donors</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">❤️ Register as Donor</TabsTrigger>
            <TabsTrigger value="request" className="flex-1">🆘 Request Blood</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Select value={searchGroup} onValueChange={setSearchGroup}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Blood Group" /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="City (optional)" value={searchCity} onChange={e => setSearchCity(e.target.value)} />
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={searchDonors}><Search className="size-4 mr-2" />Search</Button>
                </div>
                {loading ? <div className="text-center py-8"><Loader2 className="size-6 animate-spin mx-auto text-red-600" /></div> :
                  donors.length > 0 ? (
                    <div className="space-y-3">
                      {donors.map((d: any) => (
                        <div key={d.id} className="flex items-center gap-4 p-4 rounded-lg border hover:border-red-200 transition-colors">
                          <Badge className="bg-red-600 text-white text-lg px-3 py-1">{d.bloodGroup}</Badge>
                          <div className="flex-1">
                            <p className="font-medium">{d.fullName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="size-3" />{d.city || d.district}, {d.state}</p>
                          </div>
                          <a href={`tel:${d.phone}`}><Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"><Phone className="size-4 mr-1" />Call</Button></a>
                        </div>
                      ))}
                    </div>
                  ) : searchGroup && <p className="text-center text-gray-400 py-8">No donors found. Try a different blood group or city.</p>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            {submitted ? (
              <Card><CardContent className="p-8 text-center"><Heart className="size-12 text-red-600 mx-auto mb-4" /><h2 className="text-xl font-bold">Thank You!</h2><p className="text-gray-500 mt-2">You are now registered as a blood donor.</p></CardContent></Card>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Full Name *</Label><Input value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} /></div>
                    <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} /></div>
                    <div><Label>Blood Group *</Label><Select value={form.bloodGroup} onValueChange={v => setForm(p => ({...p, bloodGroup: v}))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Gender</Label><Select value={form.gender} onValueChange={v => setForm(p => ({...p, gender: v}))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select></div>
                    <div><Label>State</Label><Input value={form.state} onChange={e => setForm(p => ({...p, state: e.target.value}))} /></div>
                    <div><Label>District</Label><Input value={form.district} onChange={e => setForm(p => ({...p, district: e.target.value}))} /></div>
                    <div><Label>City</Label><Input value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} /></div>
                    <div><Label>Pincode</Label><Input value={form.pincode} onChange={e => setForm(p => ({...p, pincode: e.target.value}))} /></div>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleRegister} disabled={submitting}>
                    {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Heart className="size-4 mr-2" />}Register as Donor
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="request">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-4">Submit an urgent blood request. Matching donors will be notified.</p>
                <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const data = Object.fromEntries(fd); await fetch('/api/blood-bank/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); alert('Request submitted!'); (e.target as HTMLFormElement).reset() }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Patient Name *</Label><Input name="patientName" required /></div>
                    <div><Label>Blood Group *</Label><Select name="bloodGroup"><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select></div>
                    <div><Label>Units Needed</Label><Input name="units" type="number" defaultValue="1" /></div>
                    <div><Label>Hospital</Label><Input name="hospital" /></div>
                    <div><Label>City</Label><Input name="city" /></div>
                    <div><Label>Contact Phone *</Label><Input name="contactPhone" required /></div>
                    <div><Label>Contact Name *</Label><Input name="contactName" required /></div>
                    <div><Label>Urgency</Label><Select name="urgency"><SelectTrigger><SelectValue placeholder="Normal" /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="urgent">Urgent</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
                  </div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Submit Blood Request</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
