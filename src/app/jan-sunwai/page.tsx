'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Plus, MapPin, Upload, Loader2, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'roads', label: { en: 'Roads & Infrastructure', hi: 'सड़कें और बुनियादी ढांचा', ml: 'റോഡുകളും അടിസ്ഥാന സൗകര്യങ്ങളും' } },
  { value: 'water', label: { en: 'Water Supply', hi: 'जल आपूर्ति', ml: 'കുടിവെള്ള വിതരണം' } },
  { value: 'electricity', label: { en: 'Electricity & Power', hi: 'बिजली और ऊर्जा', ml: 'വൈദ്യുതി' } },
  { value: 'sanitation', label: { en: 'Sanitation & Waste', hi: 'स्वच्छता और अपशिष्ट', ml: 'ശുചിത്വവും മാലിന്യവും' } },
  { value: 'education', label: { en: 'Education & Schools', hi: 'शिक्षा और स्कूल', ml: 'വിദ്യാഭ്യാസവും സ്കൂളുകളും' } },
  { value: 'health', label: { en: 'Healthcare Services', hi: 'स्वास्थ्य सेवाएं', ml: 'ആരോഗ്യ സേവനങ്ങൾ' } },
  { value: 'corruption', label: { en: 'Corruption & Malpractice', hi: 'भ्रष्टाचार और कदाचार', ml: 'അഴിമതി' } },
  { value: 'other', label: { en: 'Other Issues', hi: 'अन्य मुद्दे', ml: 'മറ്റ് പ്രശ്നങ്ങൾ' } }
]

const STATES = ['Bihar', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Delhi', 'Other']

export default function JanSunwaiPage() {
  const [lang, setLang] = useState<'en' | 'hi' | 'ml'>('en')
  const [tab, setTab] = useState('submit')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [ticketInput, setTicketInput] = useState('')
  const [trackingGrievance, setTrackingGrievance] = useState<any>(null)
  const [trackingError, setTrackingError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [newTicketNo, setNewTicketNo] = useState('')

  const [form, setForm] = useState({
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
    category: 'general',
    subject: '',
    description: '',
    location: '',
    state: '',
    district: '',
    ward: '',
    imageUrls: '[]'
  })

  // Multi-lingual content dictionary
  const t = {
    en: {
      title: "🏛️ Jan Sunwai (Grievance Portal)",
      subtitle: "Register public grievances directly with YHAM leaders and track the resolution progress in real-time.",
      submitTab: "📝 File Complaint",
      trackTab: "🔍 Track Status",
      howToUse: "How to use this portal: Fill in the form below with exact details. Make sure your phone number is correct. If you have a ticket number, switch to the 'Track Status' tab to check resolution updates.",
      name: "Full Name *",
      phone: "Phone Number *",
      email: "Email (Optional)",
      category: "Category *",
      subject: "Subject *",
      description: "Detailed Description *",
      location: "Location / Landmark *",
      state: "State",
      district: "District",
      ward: "Ward No",
      uploadPhoto: "Upload Evidence Photo (Max 5MB)",
      submitBtn: "Submit Grievance",
      submitting: "Submitting...",
      successTitle: "Grievance Registered Successfully!",
      successText: "Your grievance ticket has been generated. Please save your ticket number for future tracking:",
      trackPlaceholder: "Enter your Ticket ID (e.g. cli...",
      trackBtn: "Track Grievance",
      noGrievance: "No grievance found with this Ticket ID.",
      status: "Status",
      priority: "Priority",
      assignedTo: "Assigned To",
      resolution: "Resolution Details",
      timeline: "Progress Timeline",
      resolvedAt: "Resolved At",
      backToHome: "Back to Home",
      resetForm: "Clear Form"
    },
    hi: {
      title: "🏛️ जन सुनवाई (शिकायत पोर्टल)",
      subtitle: "जनता की शिकायतों को सीधे YHAM नेताओं के पास दर्ज करें और वास्तविक समय में समाधान की प्रगति को ट्रैक करें।",
      submitTab: "📝 शिकायत दर्ज करें",
      trackTab: "🔍 स्थिति ट्रैक करें",
      howToUse: "इस पोर्टल का उपयोग कैसे करें: सटीक विवरण के साथ नीचे दिया गया फ़ॉर्म भरें। सुनिश्चित करें कि आपका फ़ोन नंबर सही है। यदि आपके पास टिकट संख्या है, तो समाधान अपडेट देखने के लिए 'स्थिति ट्रैक करें' टैब पर जाएँ।",
      name: "पूरा नाम *",
      phone: "फ़ोन नंबर *",
      email: "ईमेल (वैकल्पिक)",
      category: "श्रेणी *",
      subject: "विषय *",
      description: "विस्तृत विवरण *",
      location: "स्थान / मील का पत्थर *",
      state: "राज्य",
      district: "जिला",
      ward: "वार्ड संख्या",
      uploadPhoto: "साक्ष्य फोटो अपलोड करें (अधिकतम 5MB)",
      submitBtn: "शिकायत दर्ज करें",
      submitting: "दर्ज की जा रही है...",
      successTitle: "शिकायत सफलतापूर्वक पंजीकृत!",
      successText: "आपका शिकायत टिकट जनरेट हो गया है। भविष्य में ट्रैक करने के लिए कृपया अपना टिकट नंबर सहेजें:",
      trackPlaceholder: "अपना टिकट आईडी दर्ज करें...",
      trackBtn: "ट्रैक करें",
      noGrievance: "इस टिकट आईडी के साथ कोई शिकायत नहीं मिली।",
      status: "स्थिति",
      priority: "प्राथमिकता",
      assignedTo: "सौंपा गया",
      resolution: "समाधान विवरण",
      timeline: "प्रगति समयरेखा",
      resolvedAt: "समाधान तिथि",
      backToHome: "मुख्य पृष्ठ पर वापस",
      resetForm: "फ़ॉर्म साफ़ करें"
    },
    ml: {
      title: "🏛️ ജന സമ്പർക്ക പോർട്ടൽ (പരാതി പരിഹാരം)",
      subtitle: "പൊതു ജനങ്ങളുടെ പരാതികൾ നേരിട്ട് YHAM നേതാക്കൾക്ക് സമർപ്പിക്കുകയും തത്സമയം പുരോഗതി പരിശോധിക്കുകയും ചെയ്യുക.",
      submitTab: "📝 പരാതി സമർപ്പിക്കുക",
      trackTab: "🔍 പുരോഗതി പരിശോധിക്കുക",
      howToUse: "ഈ പോർട്ടൽ എങ്ങനെ ഉപയോഗിക്കാം: താഴെ നൽകിയിരിക്കുന്ന ഫോം കൃത്യമായ വിവരങ്ങൾ നൽകി പൂരിപ്പിക്കുക. നിങ്ങളുടെ ഫോൺ നമ്പർ കൃത്യമാണെന്ന് ഉറപ്പുവരുത്തുക. നിങ്ങളുടെ പരാതിയുടെ നിലവിലെ അവസ്ഥ അറിയാൻ 'പുരോഗതി പരിശോധിക്കുക' ടാബ് ഉപയോഗിക്കുക.",
      name: "പൂർണ്ണമായ പേര് *",
      phone: "ഫോൺ നമ്പർ *",
      email: "ഇമെയിൽ (നിർബന്ധമില്ലാത്തത്)",
      category: "വിഭാഗം *",
      subject: "വിഷയം *",
      description: "വിശദമായ വിവരണം *",
      location: "സ്ഥലം / ലാൻഡ്മാർക്ക് *",
      state: "സംസ്ഥാനം",
      district: "ജില്ല",
      ward: "വാർഡ് നമ്പർ",
      uploadPhoto: "തെളിവ് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക (പരമാവധി 5MB)",
      submitBtn: "പരാതി സമർപ്പിക്കുക",
      submitting: "സമർപ്പിക്കുന്നു...",
      successTitle: "പരാതി വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!",
      successText: "നിങ്ങളുടെ പരാതി നമ്പർ ജനറേറ്റ് ചെയ്തിട്ടുണ്ട്. തുടർന്നുള്ള പരിശോധനകൾക്കായി ഈ നമ്പർ സൂക്ഷിക്കുക:",
      trackPlaceholder: "നിങ്ങളുടെ പരാതി നമ്പർ ഇവിടെ നൽകുക...",
      trackBtn: "പരാതി പരിശോധിക്കുക",
      noGrievance: "ഈ പരാതി നമ്പറിൽ റെക്കോർഡുകൾ ഒന്നും കണ്ടെത്തിയില്ല.",
      status: "പദവി",
      priority: "മുൻഗണന",
      assignedTo: "ചുമതലപ്പെടുത്തിയിരിക്കുന്നയാൾ",
      resolution: "പരിഹാര വിവരണം",
      timeline: "ടൈംലൈൻ",
      resolvedAt: "പരിഹരിച്ച തീയതി",
      backToHome: "പ്രധാന പേജിലേക്ക് മടങ്ങുക",
      resetForm: "ഫോം മായ്ക്കുക"
    }
  }[lang]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/grievances/public-upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        setForm(prev => {
          let urls = []
          try {
            urls = JSON.parse(prev.imageUrls)
          } catch { urls = [] }
          urls.push(data.url)
          return { ...prev, imageUrls: JSON.stringify(urls) }
        })
      } else {
        const err = await res.json()
        alert(err.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.citizenName || !form.citizenPhone || !form.subject || !form.description) {
      alert('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        const data = await res.json()
        setNewTicketNo(data.ticketNo)
        setSubmitted(true)
        // Reset form
        handleReset()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to submit grievance')
      }
    } catch {
      alert('Failed to submit grievance')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({
      citizenName: '',
      citizenPhone: '',
      citizenEmail: '',
      category: 'general',
      subject: '',
      description: '',
      location: '',
      state: '',
      district: '',
      ward: '',
      imageUrls: '[]'
    })
  }

  const handleTrack = async () => {
    if (!ticketInput.trim()) return
    setLoading(true)
    setTrackingGrievance(null)
    setTrackingError('')
    try {
      const res = await fetch(`/api/grievances/track?ticketNo=${encodeURIComponent(ticketInput.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setTrackingGrievance(data)
      } else {
        setTrackingError(t.noGrievance)
      }
    } catch {
      setTrackingError('Failed to fetch grievance data.')
    } finally {
      setLoading(false)
    }
  }

  const uploadedFiles: string[] = (() => {
    try {
      return JSON.parse(form.imageUrls)
    } catch {
      return []
    }
  })()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-gray-800">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="size-6 text-[#FF9933]" />
            <span className="font-bold text-gray-900">YHAM Jan Sunwai</span>
          </Link>
          <div className="flex items-center gap-3">
            <Select value={lang} onValueChange={(v: any) => setLang(v)}>
              <SelectTrigger className="w-28 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="ml">മലയാളം</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-6 grid grid-cols-2">
            <TabsTrigger value="submit" className="flex items-center gap-1.5 py-3">
              <Plus className="size-4" /> {t.submitTab}
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-1.5 py-3">
              <Search className="size-4" /> {t.trackTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            {submitted ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Card className="border-2 border-green-200">
                  <CardContent className="p-8 text-center space-y-6">
                    <CheckCircle className="size-16 text-green-600 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-900">{t.successTitle}</h2>
                    <p className="text-gray-600 max-w-md mx-auto">{t.successText}</p>
                    <div className="bg-gray-100 font-mono text-xl py-3 px-6 rounded-md select-all inline-block border font-bold text-gray-800">
                      {newTicketNo}
                    </div>
                    <div className="pt-4 flex justify-center gap-4">
                      <Button variant="outline" onClick={() => setSubmitted(false)}>{t.submitTab}</Button>
                      <Button style={{ backgroundColor: '#FF9933', color: '#000' }} onClick={() => { setSubmitted(false); setTab('track'); setTicketInput(newTicketNo); }}>
                        {t.trackTab}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-lg p-4 text-sm text-[#FF9933]/90 flex gap-2">
                  <span className="font-bold">ℹ️</span>
                  <p>{t.howToUse}</p>
                </div>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Grievance Form</CardTitle>
                    <CardDescription>All fields marked with * are mandatory.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="citizenName">{t.name}</Label>
                          <Input id="citizenName" required value={form.citizenName} onChange={e => setForm(p => ({ ...p, citizenName: e.target.value }))} placeholder="e.g. Rajesh Kumar" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="citizenPhone">{t.phone}</Label>
                          <Input id="citizenPhone" required type="tel" value={form.citizenPhone} onChange={e => setForm(p => ({ ...p, citizenPhone: e.target.value }))} placeholder="e.g. +91-XXXXXXXXXX" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="citizenEmail">{t.email}</Label>
                          <Input id="citizenEmail" type="email" value={form.citizenEmail} onChange={e => setForm(p => ({ ...p, citizenEmail: e.target.value }))} placeholder="e.g. rajesh@example.com" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="category">{t.category}</Label>
                          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                            <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label[lang]}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject">{t.subject}</Label>
                        <Input id="subject" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Short description of the issue" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="description">{t.description}</Label>
                        <Textarea id="description" required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Provide complete detail of the complaint..." />
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5"><MapPin className="size-4" /> Location Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="location">{t.location}</Label>
                            <Input id="location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Village/Street Name, Land Mark" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="state">{t.state}</Label>
                            <Select value={form.state} onValueChange={v => setForm(p => ({ ...p, state: v }))}>
                              <SelectTrigger id="state"><SelectValue placeholder="Select State" /></SelectTrigger>
                              <SelectContent>
                                {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="district">{t.district}</Label>
                            <Input id="district" value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} placeholder="District name" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="ward">{t.ward}</Label>
                            <Input id="ward" value={form.ward} onChange={e => setForm(p => ({ ...p, ward: e.target.value }))} placeholder="Ward number" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-1.5"><Upload className="size-4" /> Evidence Attachments</h3>
                        <div className="flex items-center gap-4">
                          <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="max-w-xs" />
                          {uploading && <Loader2 className="size-4 animate-spin text-[#FF9933]" />}
                        </div>
                        {uploadedFiles.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {uploadedFiles.map((url, i) => (
                              <img key={i} src={url} alt="Evidence preview" className="size-16 object-cover border rounded-md" />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-6 flex justify-between gap-4">
                        <Button type="button" variant="ghost" onClick={handleReset} className="text-red-500 hover:bg-red-50">{t.resetForm}</Button>
                        <Button type="submit" disabled={loading} style={{ backgroundColor: '#FF9933', color: '#000' }} className="px-6 font-semibold">
                          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
                          {t.submitBtn}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="track">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>{t.trackTab}</CardTitle>
                <CardDescription>Track the official resolution response using your complaint ticket reference number.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-3">
                  <Input placeholder={t.trackPlaceholder} value={ticketInput} onChange={e => setTicketInput(e.target.value)} className="font-mono" />
                  <Button onClick={handleTrack} disabled={loading} style={{ backgroundColor: '#FF9933', color: '#000' }}>
                    {loading ? <Loader2 className="size-4 animate-spin mr-1" /> : <Search className="size-4 mr-1" />}
                    {t.trackBtn}
                  </Button>
                </div>

                {trackingError && (
                  <p className="text-center text-red-500 font-medium py-4">{trackingError}</p>
                )}

                {trackingGrievance && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border-t pt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 border rounded-md">
                        <p className="text-xs text-gray-500 font-bold uppercase">{t.status}</p>
                        <Badge className="mt-1 bg-[#FF9933] text-black capitalize">{trackingGrievance.status}</Badge>
                      </div>
                      <div className="p-3 bg-gray-50 border rounded-md">
                        <p className="text-xs text-gray-500 font-bold uppercase">{t.priority}</p>
                        <Badge variant="outline" className="mt-1 capitalize">{trackingGrievance.priority}</Badge>
                      </div>
                      <div className="p-3 bg-gray-50 border rounded-md">
                        <p className="text-xs text-gray-500 font-bold uppercase">{t.assignedTo}</p>
                        <p className="text-sm font-medium mt-1">{trackingGrievance.assignedTo || 'Unassigned'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 border rounded-md">
                        <p className="text-xs text-gray-500 font-bold uppercase">Registered On</p>
                        <p className="text-sm font-medium mt-1">{new Date(trackingGrievance.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">{t.subject}</h4>
                      <p className="bg-gray-50 border p-4 rounded-md text-sm">{trackingGrievance.subject}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900">{t.description}</h4>
                      <p className="bg-gray-50 border p-4 rounded-md text-sm whitespace-pre-wrap">{trackingGrievance.description}</p>
                    </div>

                    {trackingGrievance.resolution && (
                      <div className="space-y-2 border-l-4 border-green-500 pl-4 bg-green-50/50 py-3">
                        <h4 className="font-bold text-green-800 flex items-center gap-1.5">✅ {t.resolution}</h4>
                        <p className="text-sm text-green-700 whitespace-pre-wrap">{trackingGrievance.resolution}</p>
                        {trackingGrievance.resolvedAt && (
                          <p className="text-xs text-gray-400 mt-1">{t.resolvedAt}: {new Date(trackingGrievance.resolvedAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-1.5"><Clock className="size-4" /> {t.timeline}</h4>
                      <div className="relative pl-6 border-l space-y-4">
                        <div className="relative">
                          <span className="absolute -left-[30px] top-1.5 size-4 rounded-full border-2 border-green-500 bg-white" />
                          <p className="text-sm font-semibold">Grievance Registered</p>
                          <p className="text-xs text-gray-500">{new Date(trackingGrievance.createdAt).toLocaleString()}</p>
                        </div>
                        {trackingGrievance.status !== 'open' && (
                          <div className="relative">
                            <span className="absolute -left-[30px] top-1.5 size-4 rounded-full border-2 border-orange-500 bg-white" />
                            <p className="text-sm font-semibold">Grievance Processed</p>
                            <p className="text-xs text-gray-500">Marked as: <span className="capitalize">{trackingGrievance.status.replace('_', ' ')}</span></p>
                          </div>
                        )}
                        {trackingGrievance.resolvedAt && (
                          <div className="relative">
                            <span className="absolute -left-[30px] top-1.5 size-4 rounded-full border-2 border-green-600 bg-green-600" />
                            <p className="text-sm font-semibold text-green-700 font-bold">Grievance Resolved</p>
                            <p className="text-xs text-gray-500">{new Date(trackingGrievance.resolvedAt).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
