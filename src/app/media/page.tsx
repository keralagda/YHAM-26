'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Globe, FileText, Download, Loader2, ArrowLeft, Maximize2, Play, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'

const DOCUMENTS = [
  { title: { en: 'YHAM Policy Manifesto 2026', hi: 'YHAM नीति घोषणा पत्र 2026', ml: 'YHAM നയ പ്രകടന പത്രിക 2026' }, size: '4.2 MB', ext: 'PDF' },
  { title: { en: 'Cadre Code of Conduct Guideline', hi: 'कैडर आचार संहिता दिशानिर्देश', ml: 'അംഗങ്ങളുടെ പെരുമാറ്റച്ചട്ടം' }, size: '1.8 MB', ext: 'PDF' },
  { title: { en: 'Grassroots Mobilization Handbook', hi: 'जमीनी स्तर पर लामबंदी हैंडबुक', ml: 'പ്രാദേശിക പ്രവർത്തന സഹായി' }, size: '2.5 MB', ext: 'PDF' },
]

export default function MediaCenterPage() {
  const [lang, setLang] = useState<'en' | 'hi' | 'ml'>('en')
  const [tab, setTab] = useState('all')
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxItem, setLightboxItem] = useState<any>(null)

  const t = {
    en: {
      title: "📰 YHAM Media & Press Center",
      subtitle: "Stay updated with the latest news, press releases, video coverages, and photo galleries from our grassroots campaigns.",
      tabAll: "All Media",
      tabPress: "News & Press",
      tabGallery: "Photo Gallery",
      tabVideos: "Video Library",
      tabDocs: "Manifesto & Docs",
      downloadBtn: "Download File",
      viewLabel: "Click to expand image",
      noMedia: "No media assets found in this category.",
      back: "Back to Home",
      by: "Posted on"
    },
    hi: {
      title: "📰 YHAM मीडिया और प्रेस सेंटर",
      subtitle: "हमारे जमीनी अभियानों से नवीनतम समाचार, प्रेस विज्ञप्ति, वीडियो कवरेज और फोटो गैलरी से अपडेट रहें।",
      tabAll: "सभी मीडिया",
      tabPress: "समाचार और प्रेस",
      tabGallery: "फोटो गैलरी",
      tabVideos: "वीडियो लाइब्रेरी",
      tabDocs: "घोषणापत्र और दस्तावेज",
      downloadBtn: "फ़ाइल डाउनलोड करें",
      viewLabel: "छवि बड़ी करने के लिए क्लिक करें",
      noMedia: "इस श्रेणी में कोई मीडिया संपत्ति नहीं मिली।",
      back: "मुख्य पृष्ठ पर वापस",
      by: "दिनांक"
    },
    ml: {
      title: "📰 YHAM മീഡിയ & പ്രസ് സെന്റർ",
      subtitle: "ഞങ്ങളുടെ പ്രാദേശിക പ്രവർത്തനങ്ങളുടെ റാലികൾ, യോഗങ്ങൾ, പ്രസ് റിലീസുകൾ, ഫോട്ടോകൾ, വീഡിയോകൾ എന്നിവ കാണുക.",
      tabAll: "എല്ലാം",
      tabPress: "വാർത്തകളും അറിയിപ്പുകളും",
      tabGallery: "ഫോട്ടോ ഗാലറി",
      tabVideos: "വീഡിയോകൾ",
      tabDocs: "പ്രകടനപത്രിക & രേഖകൾ",
      downloadBtn: "ഡൗൺലോഡ് ചെയ്യുക",
      viewLabel: "വലുതാക്കി കാണാൻ ക്ലിക്ക് ചെയ്യുക",
      noMedia: "ഈ വിഭാഗത്തിൽ മറ്റ് ഫയലുകൾ ലഭ്യമല്ല.",
      back: "പ്രധാന പേജിലേക്ക് മടങ്ങുക",
      by: "തീയതി"
    }
  }[lang]

  useEffect(() => {
    setLoading(true)
    fetch('/api/media/public')
      .then(r => r.ok ? r.json() : [])
      .then(setMedia)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredMedia = media.filter(m => {
    if (tab === 'all') return true
    if (tab === 'press') return m.category === 'news' || m.category === 'press'
    if (tab === 'gallery') return m.mimeType.startsWith('image/')
    if (tab === 'videos') return m.mimeType.startsWith('video/') || m.url.includes('youtube') || m.url.includes('vimeo')
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-gray-800">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image className="size-6 text-[#FF9933]" />
            <span className="font-bold text-gray-900">YHAM Media Hub</span>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full mb-8 grid grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="all">{t.tabAll}</TabsTrigger>
            <TabsTrigger value="press">{t.tabPress}</TabsTrigger>
            <TabsTrigger value="gallery">{t.tabGallery}</TabsTrigger>
            <TabsTrigger value="videos">{t.tabVideos}</TabsTrigger>
            <TabsTrigger value="docs">{t.tabDocs}</TabsTrigger>
          </TabsList>

          {loading && tab !== 'docs' ? (
            <div className="py-24 text-center">
              <Loader2 className="size-10 animate-spin mx-auto text-[#FF9933]" />
            </div>
          ) : tab === 'docs' ? (
            /* Documents & Manifesto View */
            <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
              {DOCUMENTS.map((doc, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 text-red-600 rounded-lg font-bold text-xs select-none">
                        {doc.ext}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{doc.title[lang]}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1 text-gray-600">
                      <Download className="size-4" /> <span className="hidden sm:inline">{t.downloadBtn}</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Gallery, Video & Press List */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMedia.length > 0 ? (
                filteredMedia.map(m => {
                  const isVideo = m.mimeType?.startsWith('video/') || m.url.includes('youtube') || m.url.includes('vimeo')
                  return (
                    <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col justify-between h-full bg-white relative">
                        <div>
                          <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setLightboxItem(m)}>
                            <img src={isVideo ? '/screenshot-home.png' : m.url} alt={m.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              {isVideo ? (
                                <Play className="size-10 text-white fill-white" />
                              ) : (
                                <Maximize2 className="size-8 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="capitalize text-[10px]">{m.category}</Badge>
                              {isVideo && <Badge className="bg-red-600 text-white text-[9px] font-bold">VIDEO</Badge>}
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{m.alt || m.filename}</h4>
                          </div>
                        </div>
                        <div className="px-4 pb-4 border-t pt-3 flex items-center justify-between text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="size-3" /> {t.by}: {new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-24 text-gray-400 font-medium">
                  {t.noMedia}
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>

      {/* Lightbox / Video Embed Dialog */}
      <Dialog open={!!lightboxItem} onOpenChange={(open) => !open && setLightboxItem(null)}>
        <DialogContent className="max-w-4xl p-1 bg-black border-none overflow-hidden">
          {lightboxItem && (
            <div className="relative w-full h-[65vh] bg-black flex items-center justify-center">
              {lightboxItem.mimeType?.startsWith('video/') || lightboxItem.url.includes('youtube') || lightboxItem.url.includes('vimeo') ? (
                <video src={lightboxItem.url} controls className="max-w-full max-h-full object-contain" autoPlay />
              ) : (
                <img src={lightboxItem.url} alt={lightboxItem.alt} className="max-w-full max-h-full object-contain" />
              )}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg p-3 text-white text-xs">
                <p className="font-semibold text-sm">{lightboxItem.alt || lightboxItem.filename}</p>
                <p className="text-[10px] text-white/60 mt-1 capitalize">{lightboxItem.category} • {new Date(lightboxItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
