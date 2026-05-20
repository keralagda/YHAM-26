'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ArrowLeft, Facebook, Twitter, Instagram, Globe, X } from 'lucide-react'
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

interface Leader {
  nameHi: string; nameEn: string; nameMl: string
  roleHi: string; roleEn: string; roleMl: string
  image?: string
  socials?: { facebook?: string; twitter?: string; instagram?: string }
}

const NATIONAL_EXECUTIVE: Leader[] = [
  { nameHi: 'श्री जीतन राम मांझी', nameEn: 'Shri Jitan Ram Manjhi', nameMl: 'ശ്രീ ജിതൻ റാം മാഞ്ചി', roleHi: 'मुख्य संरक्षक', roleEn: 'Chief Patron', roleMl: 'മുഖ്യ രക്ഷാധികാരി', image: 'https://ham.org.in/wp-content/uploads/2024/07/Jitan-Ram-Manjhi.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'डॉ० संतोष कुमार सुमन', nameEn: 'Dr. Santosh Kumar Suman', nameMl: 'ഡോ. സന്തോഷ് കുമാർ സുമൻ', roleHi: 'राष्ट्रीय अध्यक्ष', roleEn: 'National President', roleMl: 'ദേശീയ അധ്യക്ഷൻ', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री प्रफुल्ल कुमार माँझी', nameEn: 'Shri Prafulla Kumar Manjhi', nameMl: 'ശ്രീ പ്രഫുല്ല കുമാർ മാഞ്ചി', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', image: 'https://ham.org.in/wp-content/uploads/2024/07/Prafulla-Manjhi-MLA.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'श्रीमती ज्योति देवी', nameEn: 'Smt. Jyoti Devi', nameMl: 'ശ്രീമതി ജ്യോതി ദേവി', roleHi: 'राष्ट्रीय महासचिव', roleEn: 'National General Secretary', roleMl: 'ദേശീയ ജനറൽ സെക്രട്ടറി', image: 'https://ham.org.in/wp-content/uploads/2024/07/Jyoti-Devi-MLA.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'श्री राजेश कुमार पाण्डेय', nameEn: 'Shri Rajesh Kumar Pandey', nameMl: 'ശ്രീ രാജേഷ് കുമാർ പാണ്ഡേ', roleHi: 'राष्ट्रीय प्रधान महासचिव', roleEn: 'National Chief General Secretary', roleMl: 'ദേശീയ ചീഫ് ജനറൽ സെക്രട്ടറി', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'डॉ. बिरेन्द्र कुमार सिंह', nameEn: 'Dr. Birendra Kumar Singh', nameMl: 'ഡോ. ബിരേന്ദ്ര കുമാർ സിംഗ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%A1%E0%A5%89-%E0%A4%B5%E0%A5%80%E0%A4%B0%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री मारकंडेय प्रसाद', nameEn: 'Shri Markandeya Prasad', nameMl: 'ശ്രീ മാർക്കണ്ഡേയ പ്രസാദ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A4%82%E0%A4%A1%E0%A5%87%E0%A4%AF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A4%BE%E0%A4%A6.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री रमेश सिंह', nameEn: 'Shri Ramesh Singh', nameMl: 'ശ്രീ രമേഷ് സിംഗ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B0%E0%A4%AE%E0%A5%87%E0%A4%B6-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'श्री दिलीप यादव', nameEn: 'Shri Dilip Yadav', nameMl: 'ശ്രീ ദിലീപ് യാദവ്', roleHi: 'राष्ट्रीय सचिव', roleEn: 'National Secretary', roleMl: 'ദേശീയ സെക്രട്ടറി', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%A6%E0%A4%BF%E0%A4%B2%E0%A5%80%E0%A4%AA-%E0%A4%AF%E0%A4%BE%E0%A4%A6%E0%A4%B5.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'श्री सुनील चौबे', nameEn: 'Shri Sunil Choubey', nameMl: 'ശ്രീ സുനിൽ ചൗബേ', roleHi: 'राष्ट्रीय महासचिव', roleEn: 'National General Secretary', roleMl: 'ദേശീയ ജനറൽ സെക്രട്ടറി', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'ई. देवेन्द्र कुमार (माँझी)', nameEn: 'E. Devendra Kumar (Manjhi)', nameMl: 'ഇ. ദേവേന്ദ്ര കുമാർ (മാഞ്ചി)', roleHi: 'राष्ट्रीय महासचिव', roleEn: 'National General Secretary', roleMl: 'ദേശീയ ജനറൽ സെക്രട്ടറി', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री अमरेन्द्र शर्मा', nameEn: 'Shri Amarendra Sharma', nameMl: 'ശ്രീ അമരേന്ദ്ര ശർമ', roleHi: 'राष्ट्रीय सचिव', roleEn: 'National Secretary', roleMl: 'ദേശീയ സെക്രട്ടറി', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%85%E0%A4%AE%E0%A4%B0%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%B6%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BE.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री कामता ऋषियासन', nameEn: 'Shri Kamta Rishiyasan', nameMl: 'ശ്രീ കാമ്ത ഋഷിയാസൻ', roleHi: 'राष्ट्रीय कोषाध्यक्ष', roleEn: 'National Treasurer', roleMl: 'ദേശീയ ട്രഷറർ', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%95%E0%A4%BE%E0%A4%AE%E0%A4%A4%E0%A4%BE-%E0%A4%8B%E0%A4%B7%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%B8%E0%A4%A8.png', socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
  { nameHi: 'श्री श्याम सुन्दर शरण', nameEn: 'Shri Shyam Sundar Sharan', nameMl: 'ശ്രീ ശ്യാം സുന്ദർ ശരൺ', roleHi: 'मुख्य राष्ट्रीय प्रवक्ता', roleEn: 'Chief National Spokesperson', roleMl: 'മുഖ്യ ദേശീയ വക്താവ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/shiv-sharan-sir.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्रीमती पुजा सिंह', nameEn: 'Smt. Pooja Singh', nameMl: 'ശ്രീമതി പൂജ സിംഗ്', roleHi: 'राष्ट्रीय प्रवक्ता', roleEn: 'National Spokesperson', roleMl: 'ദേശീയ വക്താവ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%AA%E0%A5%81%E0%A4%9C%E0%A4%BE-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9.png', socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' } },
  { nameHi: 'श्री राजीव रंजन उर्फ साकेत यादव', nameEn: 'Shri Rajeev Ranjan alias Saket Yadav', nameMl: 'ശ്രീ രാജീവ് രഞ്ജൻ അഥവാ സാകേത് യാദവ്', roleHi: 'मीडिया प्रभारी', roleEn: 'Media In-charge', roleMl: 'മീഡിയ ഇൻ-ചാർജ്', image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%80%E0%A4%B5-%E0%A4%B0%E0%A4%82%E0%A4%9C%E0%A4%A8.png', socials: { facebook: 'https://www.facebook.com/rajeev14ap', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' } },
]

export default function NationalLeadershipPage() {
  const [lang, setLang] = useState<Language>('hi')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null)
  const t = pageText[lang]

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
            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-300 text-sm text-gray-700 hover:text-red-700 transition-colors"
              >
                <Globe className="size-4" />
                <span className="hidden sm:inline">{langLabels[lang]}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    {(Object.keys(langLabels) as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setShowLangMenu(false) }}
                        className={`block w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors ${lang === l ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700'}`}
                      >
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

      {/* Hero - HAM Red/White Theme */}
      <section className="relative py-16 bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-300 blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              {t.badge}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">{t.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {NATIONAL_EXECUTIVE.map((leader, idx) => {
            const name = lang === 'hi' ? leader.nameHi : lang === 'ml' ? leader.nameMl : leader.nameEn
            const role = lang === 'hi' ? leader.roleHi : lang === 'ml' ? leader.roleMl : leader.roleEn
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
              >
                <Card className="h-full border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all group">
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    <div
                      className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4 group-hover:border-red-200 transition-colors cursor-pointer hover:scale-105"
                      onClick={() => leader.image && setLightbox({ src: leader.image, name })}
                    >
                      {leader.image ? (
                        <img src={leader.image} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
                          <Users className="w-12 h-12 text-red-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">{name}</h3>
                    <Badge variant="outline" className="mt-2 text-xs border-red-200 text-red-700">
                      {role}
                    </Badge>
                    {leader.socials && (
                      <div className="flex items-center gap-3 mt-4">
                        {leader.socials.facebook && <a href={leader.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook className="size-4" /></a>}
                        {leader.socials.twitter && <a href={leader.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors"><Twitter className="size-4" /></a>}
                        {leader.socials.instagram && <a href={leader.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram className="size-4" /></a>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.name} className="w-full h-auto rounded-2xl shadow-2xl" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl p-4">
                <p className="text-white font-semibold text-lg text-center">{lightbox.name}</p>
              </div>
              <button onClick={() => setLightbox(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-100">
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer - Red/White Theme */}
      <footer className="bg-red-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70">{t.footer}</p>
        </div>
      </footer>
    </div>
  )
}
