'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ArrowLeft, Phone, Mail, Users, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Language = 'hi' | 'en' | 'ml'
const langLabels: Record<Language, string> = { hi: 'हिंदी', en: 'English', ml: 'മലയാളം' }

interface Block { id: string; type: string; content: string; settings: string }
interface Member { id: string; nameHi: string; nameEn: string; nameMl: string; roleHi: string; roleEn: string; roleMl: string; imageUrl: string; category: string; phone: string; email: string }
interface PageData { id: string; slug: string; titleHi: string; titleEn: string; titleMl: string; theme: string; blocks: Block[] }

const THEME_COLORS: Record<string, { primary: string; bg: string; light: string }> = {
  saffron: { primary: '#FF9933', bg: '#FFF8F0', light: '#FF993320' },
  'red-white': { primary: '#DC2626', bg: '#FEF2F2', light: '#DC262620' },
  navy: { primary: '#000080', bg: '#F0F0FF', light: '#00008020' },
  green: { primary: '#138808', bg: '#F0FFF0', light: '#13880820' },
}

export function PageRenderer({ page, members }: { page: PageData; members: Member[] }) {
  const [lang, setLang] = useState<Language>('hi')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null)
  const theme = THEME_COLORS[page.theme] || THEME_COLORS.saffron

  const title = lang === 'hi' ? page.titleHi : lang === 'ml' ? page.titleMl : page.titleEn

  const getContent = (block: Block) => { try { return JSON.parse(block.content) } catch { return {} } }
  const getSettings = (block: Block) => { try { return JSON.parse(block.settings) } catch { return {} } }
  const t = (content: Record<string, string>, key: string) => content[`${key}${lang === 'hi' ? 'Hi' : lang === 'ml' ? 'Ml' : 'En'}`] || content[`${key}En`] || ''

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="HAM" className="h-9 w-9" />
            <span className="font-bold text-sm" style={{ color: theme.primary }}>{title}</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm hover:border-gray-400 transition-colors">
                <Globe className="size-4" /> {langLabels[lang]}
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border z-50">
                    {(Object.keys(langLabels) as Language[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setShowLangMenu(false) }} className={`block w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 ${lang === l ? 'font-semibold' : ''}`} style={lang === l ? { color: theme.primary } : {}}>
                        {langLabels[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/"><Button variant="outline" size="sm"><ArrowLeft className="size-4 mr-1" /> Home</Button></Link>
          </div>
        </div>
      </header>

      {/* Blocks */}
      {page.blocks.map(block => {
        const content = getContent(block)
        const settings = getSettings(block)
        const padding = settings.padding || 'py-16'
        const maxWidth = settings.maxWidth || 'max-w-7xl'

        switch (block.type) {
          case 'hero':
            return (
              <section key={block.id} className="relative py-20 text-white overflow-hidden" style={{ backgroundColor: theme.primary }}>
                {content.bgImage && <img src={content.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{t(content, 'title')}</h1>
                  {content.subtitleEn && <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">{t(content, 'subtitle')}</p>}
                  {content.ctaText && <a href={content.ctaLink || '#'}><Button className="bg-white text-gray-900 hover:bg-gray-100">{content.ctaText}</Button></a>}
                </div>
              </section>
            )
          case 'text':
            return (
              <section key={block.id} className={`${padding} px-4`}>
                <div className={`${maxWidth} mx-auto`}>
                  {t(content, 'heading') && <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: theme.primary }}>{t(content, 'heading')}</h2>}
                  {t(content, 'body') && <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">{t(content, 'body')}</div>}
                </div>
              </section>
            )
          case 'leaders': {
            const category = content.category || 'ham'
            const cols = settings.columns || '4'
            const filtered = members.filter(m => m.category === category)
            return (
              <section key={block.id} className={`${padding} px-4`}>
                <div className={`${maxWidth} mx-auto`}>
                  {t(content, 'title') && <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: theme.primary }}>{t(content, 'title')}</h2>}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-6`}>
                    {filtered.map(member => {
                      const name = lang === 'hi' ? member.nameHi : lang === 'ml' ? member.nameMl : member.nameEn
                      const role = lang === 'hi' ? member.roleHi : lang === 'ml' ? member.roleMl : member.roleEn
                      return (
                        <Card key={member.id} className="border hover:shadow-lg transition-all group">
                          <CardContent className="p-6 text-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => member.imageUrl && setLightbox({ src: member.imageUrl, name })}>
                              {member.imageUrl ? <img src={member.imageUrl} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Users className="size-10 text-gray-300" /></div>}
                            </div>
                            <h3 className="font-bold text-gray-800">{name}</h3>
                            <Badge variant="outline" className="mt-2 text-xs" style={{ borderColor: theme.light, color: theme.primary }}>{role}</Badge>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }
          case 'cta':
            return (
              <section key={block.id} className="py-16 px-4 text-white" style={{ backgroundColor: theme.primary }}>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{t(content, 'heading')}</h2>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {content.phone && <a href={`tel:${content.phone}`} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg"><Phone className="size-4" />{content.phone}</a>}
                    {content.email && <a href={`mailto:${content.email}`} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg"><Mail className="size-4" />{content.email}</a>}
                  </div>
                  {content.buttonText && <a href={content.buttonLink || '#'} className="mt-6 inline-block"><Button className="bg-white text-gray-900 hover:bg-gray-100">{content.buttonText}</Button></a>}
                </div>
              </section>
            )
          case 'spacer':
            return <div key={block.id} style={{ height: `${settings.height || 48}px` }} />
          case 'stats':
            return (
              <section key={block.id} className={`${padding} px-4`}>
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                  {[1, 2, 3].map(i => content[`stat${i}Value`] && (
                    <div key={i}>
                      <p className="text-4xl font-bold" style={{ color: theme.primary }}>{content[`stat${i}Value`]}</p>
                      <p className="text-gray-600 mt-1">{content[`stat${i}Label`]}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          default:
            return null
        }
      })}

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
      <footer className="py-8 text-center text-sm text-white/70" style={{ backgroundColor: theme.primary }}>
        <p>© {new Date().getFullYear()} Hindustani Awam Morcha • All Rights Reserved</p>
      </footer>
    </div>
  )
}
