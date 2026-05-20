'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh','Andaman & Nicobar','Dadra & Nagar Haveli','Daman & Diu','Lakshadweep']
const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
const DESIGNATIONS = [
  { value: 'karyakarta', label: 'Karyakarta (Worker)' },
  { value: 'booth', label: 'Booth Level' },
  { value: 'panna_pramukh', label: 'Panna Pramukh' },
  { value: 'ward', label: 'Ward Committee' },
  { value: 'panchayat', label: 'Panchayat Committee' },
  { value: 'block', label: 'Block Committee' },
  { value: 'district', label: 'District Committee' },
  { value: 'state', label: 'State Committee' },
]

export default function JoinPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: '', fatherName: '', dob: '', gender: '', phone: '', altPhone: '',
    email: '', aadharLast4: '', bloodGroup: '', state: '', district: '', block: '',
    panchayat: '', ward: '', booth: '', pincode: '', fullAddress: '',
    designation: 'karyakarta', referredBy: '', previousParty: '',
    voterIdNumber: '', assemblyConst: '', parlConst: '',
    occupation: '', education: '', skills: '', notes: '',
  })

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/party-members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setSubmitted(true)
    } catch { /* */ }
    finally { setSubmitting(false) }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <CheckCircle className="size-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">Your membership application has been received. You will be contacted after verification.</p>
          <Link href="/"><Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">Back to Home</Button></Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="YHAM" className="h-9 w-9" />
            <span className="font-bold text-[#FF9933]">YHAM</span>
          </Link>
          <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="size-4 mr-1" /> Home</Button></Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20">सदस्यता फॉर्म</Badge>
          <h1 className="text-3xl font-bold text-gray-800">Join YHAM</h1>
          <p className="text-gray-500 mt-2">युवा हिंदुस्तानी अवाम मोर्चा में शामिल हों</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1,2,3,4].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s <= step ? 'text-[#FF9933]' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-[#FF9933] text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-[#FF9933]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-lg">{step === 1 ? 'Personal Details' : step === 2 ? 'Address & Location' : step === 3 ? 'Political Information' : 'Professional & Additional'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (<>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Full Name *</Label><Input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="पूरा नाम" /></div>
                <div><Label>Father's Name</Label><Input value={form.fatherName} onChange={e => update('fatherName', e.target.value)} placeholder="पिता का नाम" /></div>
                <div><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} /></div>
                <div><Label>Gender</Label><Select value={form.gender} onValueChange={v => update('gender', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                <div><Label>Phone *</Label><Input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91..." /></div>
                <div><Label>Alt Phone</Label><Input value={form.altPhone} onChange={e => update('altPhone', e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                <div><Label>Aadhaar (Last 4)</Label><Input maxLength={4} value={form.aadharLast4} onChange={e => update('aadharLast4', e.target.value)} placeholder="XXXX" /></div>
                <div><Label>Blood Group</Label><Select value={form.bloodGroup} onValueChange={v => update('bloodGroup', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent></Select></div>
              </div>
            </>)}
            {step === 2 && (<>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>State *</Label><Select value={form.state} onValueChange={v => update('state', v)}><SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger><SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>District</Label><Input value={form.district} onChange={e => update('district', e.target.value)} /></div>
                <div><Label>Block/Tehsil</Label><Input value={form.block} onChange={e => update('block', e.target.value)} /></div>
                <div><Label>Panchayat/Municipality</Label><Input value={form.panchayat} onChange={e => update('panchayat', e.target.value)} /></div>
                <div><Label>Ward No.</Label><Input value={form.ward} onChange={e => update('ward', e.target.value)} /></div>
                <div><Label>Booth No.</Label><Input value={form.booth} onChange={e => update('booth', e.target.value)} /></div>
                <div><Label>Pincode</Label><Input value={form.pincode} onChange={e => update('pincode', e.target.value)} maxLength={6} /></div>
              </div>
              <div><Label>Full Address</Label><Textarea value={form.fullAddress} onChange={e => update('fullAddress', e.target.value)} placeholder="Complete address" /></div>
            </>)}
            {step === 3 && (<>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Designation</Label><Select value={form.designation} onValueChange={v => update('designation', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DESIGNATIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Referred By</Label><Input value={form.referredBy} onChange={e => update('referredBy', e.target.value)} placeholder="Name of referrer" /></div>
                <div><Label>Previous Party (if any)</Label><Input value={form.previousParty} onChange={e => update('previousParty', e.target.value)} /></div>
                <div><Label>Voter ID Number</Label><Input value={form.voterIdNumber} onChange={e => update('voterIdNumber', e.target.value)} /></div>
                <div><Label>Assembly Constituency</Label><Input value={form.assemblyConst} onChange={e => update('assemblyConst', e.target.value)} /></div>
                <div><Label>Parliamentary Constituency</Label><Input value={form.parlConst} onChange={e => update('parlConst', e.target.value)} /></div>
              </div>
            </>)}
            {step === 4 && (<>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Occupation</Label><Input value={form.occupation} onChange={e => update('occupation', e.target.value)} /></div>
                <div><Label>Education</Label><Select value={form.education} onValueChange={v => update('education', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="below_10th">Below 10th</SelectItem><SelectItem value="10th">10th Pass</SelectItem><SelectItem value="12th">12th Pass</SelectItem><SelectItem value="graduate">Graduate</SelectItem><SelectItem value="post_graduate">Post Graduate</SelectItem><SelectItem value="professional">Professional Degree</SelectItem></SelectContent></Select></div>
                <div className="sm:col-span-2"><Label>Skills / Expertise</Label><Input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="e.g., Social media, Public speaking, Event management" /></div>
              </div>
              <div><Label>Additional Notes</Label><Textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any additional information" /></div>
            </>)}

            <div className="flex justify-between pt-4">
              {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>}
              {step < 4 ? <Button className="ml-auto bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => setStep(s => s + 1)}>Next</Button>
                : <Button className="ml-auto bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit} disabled={submitting}>{submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Users className="size-4 mr-2" />}Submit Application</Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
