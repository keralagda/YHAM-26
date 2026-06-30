'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Users, Video, Clock, Loader2, ArrowLeft, CheckCircle2, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'

export default function EventsPage() {
  const [lang, setLang] = useState<'en' | 'hi' | 'ml'>('en')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')

  // RSVP Modal State
  const [rsvpEvent, setRsvpEvent] = useState<any>(null)
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpPhone, setRsvpPhone] = useState('')
  const [rsvpEmail, setRsvpEmail] = useState('')
  const [rsvpSuccess, setRsvpSuccess] = useState(false)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  const t = {
    en: {
      title: "📅 YHAM Rally & Events Calendar",
      subtitle: "Join the movement. Participate in our upcoming rallies, leadership meetings, and public padyatras near you.",
      tabAll: "All Events",
      tabUpcoming: "Upcoming",
      tabLive: "Ongoing / Live",
      tabCompleted: "Completed",
      date: "Date",
      time: "Time",
      venue: "Venue",
      guest: "Chief Guest",
      organizer: "Organizer",
      expectedCrowd: "Expected Attendees",
      rsvpBtn: "RSVP / Get Invitation Ticket",
      watchStream: "Watch Live Stream",
      rsvpTitle: "Register RSVP",
      rsvpDesc: "Sign up to receive event updates, directions, and seat reservations for this event.",
      fullName: "Full Name *",
      phone: "Phone Number *",
      email: "Email (Optional)",
      submitRsvp: "Confirm RSVP",
      successTitle: "RSVP Confirmed!",
      successDesc: "Your digital invitation ticket has been generated. We have saved your seat. Check details below:",
      ticketId: "Invitation Ticket ID",
      backToHome: "Back to Home",
      emptyEvents: "No events found in this category. Check back later!",
      close: "Close"
    },
    hi: {
      title: "📅 YHAM रैली और कार्यक्रम कैलेंडर",
      subtitle: "आंदोलन का हिस्सा बनें। अपने आस-पास हमारी आगामी रैलियों, नेतृत्व बैठकों और सार्वजनिक पदयात्राओं में भाग लें।",
      tabAll: "सभी कार्यक्रम",
      tabUpcoming: "आगामी",
      tabLive: "सक्रिय / लाइव",
      tabCompleted: "पूरा हुआ",
      date: "दिनांक",
      time: "समय",
      venue: "स्थान",
      guest: "मुख्य अतिथि",
      organizer: "आयोजक",
      expectedCrowd: "अपेक्षित भीड़",
      rsvpBtn: "आरएसवीपी / आमंत्रण टिकट लें",
      watchStream: "लाइव स्ट्रीम देखें",
      rsvpTitle: "आरएसवीपी पंजीकरण",
      rsvpDesc: "इस कार्यक्रम के लिए अपडेट, दिशा-निर्देश और सीट आरक्षण प्राप्त करने के लिए साइन अप करें।",
      fullName: "पूरा नाम *",
      phone: "फ़ोन नंबर *",
      email: "ईमेल (वैकल्पिक)",
      submitRsvp: "आरएसवीपी की पुष्टि करें",
      successTitle: "आरएसवीपी की पुष्टि हो गई!",
      successDesc: "आपका डिजिटल आमंत्रण टिकट जनरेट हो गया है। हमने आपकी सीट सुरक्षित कर ली है। विवरण नीचे देखें:",
      ticketId: "आमंत्रण टिकट आईडी",
      backToHome: "मुख्य पृष्ठ पर वापस",
      emptyEvents: "इस श्रेणी में कोई कार्यक्रम नहीं मिला। बाद में पुनः जाँच करें!",
      close: "बंद करें"
    },
    ml: {
      title: "📅 YHAM റാലികളും പരിപാടികളും",
      subtitle: "ജനകീയ മുന്നേറ്റത്തിന്റെ ഭാഗമാകൂ. നിങ്ങളുടെ പ്രദേശത്ത് നടക്കുന്ന റാലികളിലും യോഗങ്ങളിലും പങ്കാളികളാകൂ.",
      tabAll: "എല്ലാ പരിപാടികളും",
      tabUpcoming: "വരാനിരിക്കുന്നവ",
      tabLive: "ലൈവ്",
      tabCompleted: "കഴിഞ്ഞവ",
      date: "തീയതി",
      time: "സമയം",
      venue: "സ്ഥലം",
      guest: "മുഖ്യ അതിഥി",
      organizer: "സംഘാടകൻ",
      expectedCrowd: "പ്രതീക്ഷിക്കുന്ന ജനപങ്കാളിത്തം",
      rsvpBtn: "പങ്കാളിത്തം ഉറപ്പാക്കുക (RSVP)",
      watchStream: "തത്സമയ സംപ്രേക്ഷണം കാണുക",
      rsvpTitle: "RSVP രജിസ്റ്റർ ചെയ്യുക",
      rsvpDesc: "സീറ്റുകൾ ബുക്ക് ചെയ്യുന്നതിനും അറിയിപ്പുകൾ ലഭിക്കുന്നതിനും ഫോം പൂരിപ്പിക്കുക.",
      fullName: "പൂർണ്ണമായ പേര് *",
      phone: "ഫോൺ നമ്പർ *",
      email: "ഇമെയിൽ (നിർബന്ധമില്ലാത്തത്)",
      submitRsvp: "സ്ഥിരീകരിക്കുക",
      successTitle: "പങ്കാളിത്തം ഉറപ്പായിരിക്കുന്നു!",
      successDesc: "നിങ്ങളുടെ ഡിജിറ്റൽ ഇൻവിറ്റേഷൻ ടിക്കറ്റ് തയ്യാറാണ്. വിവരങ്ങൾ താഴെ കാണുക:",
      ticketId: "ഇൻവിറ്റേഷൻ ടിക്കറ്റ് നമ്പർ",
      backToHome: "പ്രധാന പേജിലേക്ക് മടങ്ങുക",
      emptyEvents: "ഈ വിഭാഗത്തിൽ മറ്റ് പരിപാടികൾ നിലവിലില്ല.",
      close: "അടയ്ക്കുക"
    }
  }[lang]

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.ok ? r.json() : [])
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredEvents = events.filter(e => {
    if (selectedTab === 'all') return true
    return e.status === selectedTab
  })

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpName || !rsvpPhone) {
      alert('Please enter your Name and Phone Number')
      return
    }
    setRsvpLoading(true)

    // Simulate RSVP submission with analytics log
    setTimeout(async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'event_rsvp',
            page: `/events/${rsvpEvent.id}`,
            metadata: JSON.stringify({ rsvpName, rsvpPhone, rsvpEmail, eventTitle: rsvpEvent.title })
          })
        })
      } catch { /* */ }
      setRsvpLoading(false)
      setRsvpSuccess(true)
    }, 800)
  }

  const handleCloseRsvp = () => {
    setRsvpEvent(null)
    setRsvpName('')
    setRsvpPhone('')
    setRsvpEmail('')
    setRsvpSuccess(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-gray-800">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="size-6 text-[#138808]" />
            <span className="font-bold text-gray-900">YHAM Events</span>
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full mb-8 grid grid-cols-4 max-w-xl mx-auto">
            <TabsTrigger value="all">{t.tabAll}</TabsTrigger>
            <TabsTrigger value="upcoming">{t.tabUpcoming}</TabsTrigger>
            <TabsTrigger value="ongoing">{t.tabLive}</TabsTrigger>
            <TabsTrigger value="completed">{t.tabCompleted}</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="size-10 animate-spin mx-auto text-[#FF9933]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(e => (
                  <motion.div key={e.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#FF9933] overflow-hidden flex flex-col justify-between h-full bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Badge variant="outline" className="capitalize text-xs font-semibold px-2 py-0.5">{e.eventType}</Badge>
                          <Badge className={
                            e.status === 'ongoing' ? 'bg-red-600 text-white animate-pulse' :
                            e.status === 'upcoming' ? 'bg-[#FF9933] text-black font-semibold' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {e.status === 'ongoing' ? '🔴 Live Now' : e.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 leading-snug">{e.title}</CardTitle>
                        {e.description && (
                          <CardDescription className="text-sm mt-1 line-clamp-3">{e.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t pt-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="size-4 shrink-0 text-[#FF9933]" />
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{t.date}</p>
                              <p className="font-medium">{e.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="size-4 shrink-0 text-[#FF9933]" />
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{t.time}</p>
                              <p className="font-medium">{e.time || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <MapPin className="size-4 shrink-0 text-[#138808]" />
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{t.venue}</p>
                              <p className="font-medium">{e.venue}, {e.city}, {e.state}</p>
                            </div>
                          </div>
                          {e.chiefGuest && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="size-4 shrink-0 text-indigo-500" />
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.guest}</p>
                                <p className="font-medium">{e.chiefGuest}</p>
                              </div>
                            </div>
                          )}
                          {e.organizer && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="size-4 shrink-0 text-teal-500" />
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.organizer}</p>
                                <p className="font-medium">{e.organizer}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stream / Live Link */}
                        {e.status === 'ongoing' && e.streamUrl && (
                          <a href={e.streamUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 font-bold">
                              <Video className="size-4 animate-bounce" /> {t.watchStream}
                            </Button>
                          </a>
                        )}

                        {/* RSVP Action */}
                        {e.status === 'upcoming' && (
                          <Button className="w-full bg-[#138808] hover:bg-[#138808]/90 text-white font-semibold" onClick={() => setRsvpEvent(e)}>
                            <Ticket className="size-4 mr-2" /> {t.rsvpBtn}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400 font-medium">
                  {t.emptyEvents}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {/* RSVP Registration Dialog */}
      <Dialog open={!!rsvpEvent} onOpenChange={(open) => !open && handleCloseRsvp()}>
        <DialogContent className="max-w-md">
          {rsvpSuccess ? (
            <div className="text-center p-6 space-y-4">
              <CheckCircle2 className="size-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">{t.successTitle}</h3>
              <p className="text-sm text-gray-600">{t.successDesc}</p>
              <div className="bg-gray-100 p-4 border border-dashed rounded-lg space-y-2 text-left text-sm">
                <p className="font-bold text-gray-800">{rsvpEvent?.title}</p>
                <p className="text-xs text-gray-500">📍 {rsvpEvent?.venue}, {rsvpEvent?.city}</p>
                <p className="text-xs text-gray-500">📅 {rsvpEvent?.date} @ {rsvpEvent?.time}</p>
                <div className="border-t pt-2 mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{t.ticketId}:</span>
                  <span className="font-mono text-xs font-bold text-[#FF9933]">YHAM-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>
              <Button style={{ backgroundColor: '#FF9933', color: '#000' }} className="w-full" onClick={handleCloseRsvp}>{t.close}</Button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              <DialogHeader>
                <DialogTitle>{t.rsvpTitle}</DialogTitle>
                <DialogDescription>{t.rsvpDesc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rsvpName">{t.fullName}</Label>
                  <Input id="rsvpName" required value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Sunil Dev" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rsvpPhone">{t.phone}</Label>
                  <Input id="rsvpPhone" required type="tel" value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rsvpEmail">{t.email}</Label>
                  <Input id="rsvpEmail" type="email" value={rsvpEmail} onChange={e => setRsvpEmail(e.target.value)} placeholder="sunil@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseRsvp}>Cancel</Button>
                <Button type="submit" disabled={rsvpLoading} style={{ backgroundColor: '#FF9933', color: '#000' }}>
                  {rsvpLoading ? <Loader2 className="size-4 animate-spin mr-1" /> : <Ticket className="size-4 mr-1" />}
                  {t.submitRsvp}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
