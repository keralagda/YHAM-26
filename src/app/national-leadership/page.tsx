'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ArrowLeft, Globe, X, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Language = 'hi' | 'en' | 'ml'
const langLabels: Record<Language, string> = { hi: 'हिंदी', en: 'English', ml: 'മലയാളം' }

const pageText: Record<Language, { title: string; subtitle: string; badge: string; back: string; footer: string }> = {
  hi: {
    title: 'राष्ट्रीय नेतृत्व',
    subtitle: 'हिंदुस्तानी अवाम मोर्चा (HAM) की राष्ट्रीय कार्यकारिणी के सम्मानित सदस्य',
    badge: 'राष्ट्रीय कार्यकारिणी',
    back: 'मुख्य पृष्ठ',
    footer: '© 2025 हिंदुस्तानी अवाम मोर्चा (HAM) • सर्वाधिकार सुरक्षित',
  },
  en: {
    title: 'National Leadership',
    subtitle: 'Esteemed members of the National Executive of Hindustani Awam Morcha (HAM)',
    badge: 'National Executive',
    back: 'Back to Home',
    footer: '© 2025 Hindustani Awam Morcha (HAM) • All Rights Reserved',
  },
  ml: {
    title: 'ദേശീയ നേതൃത്വം',
    subtitle: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (HAM) ദേശീയ കാര്യനിർവാഹക സമിതിയിലെ ബഹുമാന്യ അംഗങ്ങൾ',
    badge: 'ദേശീയ കാര്യനിർവാഹക സമിതി',
    back: 'ഹോം പേജ്',
    footer: '© 2025 ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (HAM) • എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം',
  },
}

interface Member {
  id: string
  nameHi: string; nameEn: string; nameMl: string
  roleHi: string; roleEn: string; roleMl: string
  imageUrl: string; category: string; phone: string
}

export default function NationalLeadershipPage() {
  const [lang, setLang] = useState<Language>('hi')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null)
  const [hamMembers, setHamMembers] = useState<Member[]>([])
  const [yhamMembers, setYhamMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const t = pageText[lang]

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.ok ? res.json() : [])
      .then((members: Member[]) => {
        setHamMembers(members.filter(m => m.category === 'ham'))
        setYhamMembers(members.filter(m => m.category === 'yham'))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getName = (m: Member) => lang === 'hi' ? m.nameHi : lang === 'ml' ? m.nameMl : m.nameEn
  const getRole = (m: Member) => lang === 'hi' ? m.roleHi : lang === 'ml' ? m.roleMl : m.roleEn

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="HAM" className="h-10 w-10" />
            <div>
              <h1 className="text-sm font-bold text-red-700">हिंदुस्तानी अवाम मोर्चा</h1>
              <p className="text-[10px] text-gray-500">Hindustani Awam Morcha (Secular)</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-300 text-sm text-gray-700 hover:text-red-700 transition-colors">
                <Globe className="size-4" />
                <span className="hidden sm:inline">{langLabels[lang]}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                    {(Object.keys(langLabels) as Language[]).map((l) => (
                      <button key={l} onClick={() => { setLang(l); setShowLangMenu(false) }} className={`block w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors ${lang === l ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700'}`}>
                        {langLabels[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                <ArrowLeft className="size-4" /> {t.back}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-300 blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1">{t.badge}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">{t.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="size-8 animate-spin text-red-600" /></div>
        ) : (
          <>
            {/* HAM National Leaders */}
            {hamMembers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {lang === 'hi' ? 'HAM राष्ट्रीय नेतृत्व' : lang === 'ml' ? 'HAM ദേശീയ നേതൃത്വം' : 'HAM National Leadership'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {hamMembers.map((leader, idx) => (
                    <motion.div key={leader.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.03 }}>
                      <Card className="h-full border hover:border-red-300 hover:shadow-lg transition-all group">
                        <CardContent className="p-6 text-center flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4 group-hover:border-red-200 transition-colors cursor-pointer hover:scale-105" onClick={() => leader.imageUrl && setLightbox({ src: leader.imageUrl, name: getName(leader) })}>
                            {leader.imageUrl ? (
                              <img src={leader.imageUrl} alt={getName(leader)} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
                                <Users className="w-12 h-12 text-red-300" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-gray-800 leading-tight">{getName(leader)}</h3>
                          <Badge variant="outline" className="mt-2 text-xs border-red-200 text-red-700">{getRole(leader)}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* YHAM Youth Leaders */}
            {yhamMembers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {lang === 'hi' ? 'YHAM युवा नेतृत्व' : lang === 'ml' ? 'YHAM യുവ നേതൃത്വം' : 'YHAM Youth Leadership'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {yhamMembers.map((leader, idx) => (
                    <motion.div key={leader.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.03 }}>
                      <Card className="h-full border hover:border-orange-300 hover:shadow-lg transition-all group">
                        <CardContent className="p-6 text-center flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4 group-hover:border-orange-200 transition-colors cursor-pointer hover:scale-105" onClick={() => leader.imageUrl && setLightbox({ src: leader.imageUrl, name: getName(leader) })}>
                            {leader.imageUrl ? (
                              <img src={leader.imageUrl} alt={getName(leader)} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
                                <Users className="w-12 h-12 text-orange-300" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-gray-800 leading-tight">{getName(leader)}</h3>
                          <Badge variant="outline" className="mt-2 text-xs border-orange-200 text-orange-700">{getRole(leader)}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <img src={lightbox.src} alt={lightbox.name} className="w-full h-auto rounded-2xl shadow-2xl" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-4">
                <p className="text-white font-semibold text-lg text-center">{lightbox.name}</p>
              </div>
              <button onClick={() => setLightbox(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"><X className="size-4" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-red-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70">{t.footer}</p>
        </div>
      </footer>
    </div>
  )
}
