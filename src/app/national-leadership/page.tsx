'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ArrowLeft, Facebook, Twitter, Instagram } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Leader {
  name: string
  role: string
  image?: string
  socials?: { facebook?: string; twitter?: string; instagram?: string }
}

const NATIONAL_EXECUTIVE: Leader[] = [
  {
    name: 'श्री जीतन राम मांझी',
    role: 'मुख्य संरक्षक',
    image: 'https://ham.org.in/wp-content/uploads/2024/07/Jitan-Ram-Manjhi.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'डॉ० संतोष कुमार सुमन',
    role: 'राष्ट्रीय अध्यक्ष',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री प्रफुल्ल कुमार माँझी',
    role: 'राष्ट्रीय उपाध्यक्ष',
    image: 'https://ham.org.in/wp-content/uploads/2024/07/Prafulla-Manjhi-MLA.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्रीमती ज्योति देवी',
    role: 'राष्ट्रीय महासचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/07/Jyoti-Devi-MLA.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री राजेश कुमार पाण्डेय',
    role: 'राष्ट्रीय प्रधान महासचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'डॉ. बिरेन्द्र कुमार सिंह',
    role: 'राष्ट्रीय उपाध्यक्ष',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%A1%E0%A5%89-%E0%A4%B5%E0%A5%80%E0%A4%B0%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री मारकंडेय प्रसाद',
    role: 'राष्ट्रीय उपाध्यक्ष',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A4%82%E0%A4%A1%E0%A5%87%E0%A4%AF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A4%BE%E0%A4%A6.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री रमेश सिंह',
    role: 'राष्ट्रीय उपाध्यक्ष',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B0%E0%A4%AE%E0%A5%87%E0%A4%B6-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री दिलीप यादव',
    role: 'राष्ट्रीय सचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%A6%E0%A4%BF%E0%A4%B2%E0%A5%80%E0%A4%AA-%E0%A4%AF%E0%A4%BE%E0%A4%A6%E0%A4%B5.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री सुनील चौबे',
    role: 'राष्ट्रीय महासचिव',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'ई. देवेन्द्र कुमार (माँझी)',
    role: 'राष्ट्रीय महासचिव',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री अमरेन्द्र शर्मा',
    role: 'राष्ट्रीय सचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%85%E0%A4%AE%E0%A4%B0%E0%A5%87%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%B6%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BE.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री शंकर माँझी (अधिवक्ता)',
    role: 'राष्ट्रीय सचिव',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री कमलेश कुमार सिंह',
    role: 'राष्ट्रीय सचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%95%E0%A4%AE%E0%A4%B2%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री निलेश कुमार',
    role: 'राष्ट्रीय सचिव',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%A8%E0%A4%BF%E0%A4%B2%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'राजन सिद्दिकी',
    role: 'राष्ट्रीय सचिव',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री कामता ऋषियासन',
    role: 'राष्ट्रीय कोषाध्यक्ष',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%95%E0%A4%BE%E0%A4%AE%E0%A4%A4%E0%A4%BE-%E0%A4%8B%E0%A4%B7%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%B8%E0%A4%A8.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री श्याम सुन्दर शरण',
    role: 'मुख्य राष्ट्रीय प्रवक्ता',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/shiv-sharan-sir.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्रीमती पुजा सिंह',
    role: 'राष्ट्रीय प्रवक्ता',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%AA%E0%A5%81%E0%A4%9C%E0%A4%BE-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री रोमित सिंह',
    role: 'राष्ट्रीय प्रवक्ता',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री सरोज सिंह',
    role: 'राष्ट्रीय प्रवक्ता',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B8%E0%A4%B0%E0%A5%8B%E0%A4%9C-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री राजीव रंजन उर्फ साकेत यादव',
    role: 'मीडिया प्रभारी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%80%E0%A4%B5-%E0%A4%B0%E0%A4%82%E0%A4%9C%E0%A4%A8.png',
    socials: { facebook: 'https://www.facebook.com/rajeev14ap', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्रीमती अदिती शर्मा',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%AE%E0%A4%A4%E0%A5%80-%E0%A4%85%E0%A4%A6%E0%A4%BF%E0%A4%A4%E0%A5%80-%E0%A4%B6%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BE.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री रामायण राजभर',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B0%E0%A4%AE%E0%A4%BE%E0%A4%AF%E0%A4%A8-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A4%AD%E0%A4%B0-.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री रजनीश कुमार',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%9C%E0%A4%A8%E0%A5%80%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0.png',
    socials: { facebook: 'https://www.facebook.com/jitanrmanjhi', twitter: 'https://x.com/jitanrmanjhi', instagram: 'https://www.instagram.com/jitanrmanjhi/' },
  },
  {
    name: 'श्री धर्मेन्द्र भुइया',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री श्रवण भुइया',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%B5%E0%A4%A3-%E0%A4%AD%E0%A5%81%E0%A4%87%E0%A4%AF%E0%A4%BE%E0%A4%82.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री महेन्द्र माँझी',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
  {
    name: 'श्री शतादरू राय',
    role: 'सदस्य राष्ट्रीय कार्यकारिणी',
    image: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B8%E0%A4%A4%E0%A4%BE%E0%A4%A6%E0%A5%8D%E0%A4%B0%E0%A5%82-%E0%A4%B0%E0%A5%89%E0%A4%AF.png',
    socials: { facebook: 'https://www.facebook.com/SantoshKumarSumanHAM', twitter: 'https://x.com/santoshmanjhi_', instagram: 'https://www.instagram.com/sk_sumanham' },
  },
]

export default function NationalLeadershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="YHAM" className="h-10 w-10" />
            <div>
              <h1 className="text-sm font-bold text-[#000080]">हिंदुस्तानी अवाम मोर्चा</h1>
              <p className="text-[10px] text-gray-500">Hindustani Awam Morcha</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-[#000080] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#FF9933] blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#138808] blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]/30 text-sm px-4 py-1">
              राष्ट्रीय कार्यकारिणी
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              National Leadership
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              हिंदुस्तानी अवाम मोर्चा (HAM) की राष्ट्रीय कार्यकारिणी के सम्मानित सदस्य
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {NATIONAL_EXECUTIVE.map((leader, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              <Card className="h-full border border-gray-200 hover:border-[#FF9933]/50 hover:shadow-lg transition-all group overflow-hidden">
                <CardContent className="p-6 text-center flex flex-col items-center">
                  {/* Photo */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4 group-hover:border-[#FF9933]/40 transition-colors">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF9933]/20 via-white to-[#138808]/20 flex items-center justify-center">
                        <Users className="w-12 h-12 text-[#000080]/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-base font-bold text-[#000080] leading-tight">{leader.name}</h3>
                  <Badge variant="outline" className="mt-2 text-xs border-[#FF9933]/30 text-[#FF9933]">
                    {leader.role}
                  </Badge>

                  {/* Socials */}
                  {leader.socials && (
                    <div className="flex items-center gap-3 mt-4">
                      {leader.socials.facebook && (
                        <a href={leader.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors">
                          <Facebook className="size-4" />
                        </a>
                      )}
                      {leader.socials.twitter && (
                        <a href={leader.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
                          <Twitter className="size-4" />
                        </a>
                      )}
                      {leader.socials.instagram && (
                        <a href={leader.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors">
                          <Instagram className="size-4" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000080] text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} हिंदुस्तानी अवाम मोर्चा (HAM) • सर्वाधिकार सुरक्षित
          </p>
        </div>
      </footer>
    </div>
  )
}
