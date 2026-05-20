'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { translations, type Language } from '@/lib/translations'
import {
  Globe, Menu, X, ChevronRight, Phone, Mail, ExternalLink,
  Users, Building2, Landmark, GraduationCap, Briefcase, Heart,
  Shield, Eye, Target, Megaphone, Tv, Award, Handshake,
  Scale, TrendingUp, Lightbulb, MapPin, ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

function useScrollReveal() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, isInView }
}

const langLabels: Record<Language, string> = {
  hi: 'हिंदी',
  en: 'English',
  ml: 'മലയാളം',
}

interface SiteSectionData {
  id: string
  sectionKey: string
  label: string
  order: number
  visible: boolean
  sectionType: string
  contentHi: string
  contentEn: string
  contentMl: string
}

export default function Home() {
  const [lang, setLang] = useState<Language>('hi')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [siteSections, setSiteSections] = useState<SiteSectionData[]>([])
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({})

  // Fetch site sections from API on mount
  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.ok ? res.json() : [])
      .then((sections: SiteSectionData[]) => {
        setSiteSections(sections)
        const vis: Record<string, boolean> = {}
        sections.forEach(s => { vis[s.sectionKey] = s.visible })
        setSectionVisibility(vis)
      })
      .catch(() => {}) // fallback to translations
  }, [])

  // Build a merged translation: DB content overrides hardcoded translations
  const dbContent = (() => {
    const merged: Record<Language, Record<string, string>> = { hi: {}, en: {}, ml: {} }
    for (const section of siteSections) {
      try {
        const hi = JSON.parse(section.contentHi || '{}')
        const en = JSON.parse(section.contentEn || '{}')
        const ml = JSON.parse(section.contentMl || '{}')
        Object.entries(hi).forEach(([k, v]) => { merged.hi[k] = v as string })
        Object.entries(en).forEach(([k, v]) => { merged.en[k] = v as string })
        Object.entries(ml).forEach(([k, v]) => { merged.ml[k] = v as string })
      } catch { /* skip invalid JSON */ }
    }
    return merged
  })()

  const t = (key: string) => dbContent[lang]?.[key] || translations[lang][key] || key

  const isSectionVisible = (key: string) => {
    if (Object.keys(sectionVisibility).length === 0) return true
    return sectionVisibility[key] !== false
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navItems = [
    { key: 'navVision', id: 'vision' },
    { key: 'navStructure', id: 'grassroots' },
    { key: 'navOpportunities', id: 'opportunities' },
    { key: 'navNational', id: 'national' },
    { key: 'navLeadership', id: 'leadership' },
    { key: 'navContact', id: 'cta' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-[#FF9933]/10 via-white/90 to-[#138808]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#000080] flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  YH
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold text-[#000080] leading-tight">{t('orgName')}</h1>
                <p className="text-xs text-gray-500">YHAM</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollTo(item.id)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF9933] rounded-lg hover:bg-[#FF9933]/10 transition-all"
                >
                  {t(item.key)}
                </button>
              ))}
            </nav>

            {/* Language Toggle + Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#FF9933]/50 bg-white/80 transition-all text-sm font-medium"
                >
                  <Globe className="w-4 h-4 text-[#138808]" />
                  <span className="hidden sm:inline">{langLabels[lang]}</span>
                  <span className="sm:hidden">{lang.toUpperCase()}</span>
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {(Object.keys(langLabels) as Language[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setShowLangMenu(false) }}
                          className={`block w-full px-5 py-3 text-sm text-left hover:bg-[#FF9933]/10 transition-colors ${
                            lang === l ? 'bg-[#FF9933]/10 text-[#FF9933] font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {langLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors font-medium"
                  >
                    {t(item.key)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Click-away for language menu */}
      {showLangMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
      )}

      {/* Hero Section */}
      {isSectionVisible('hero') && <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/20 via-[#FFF8F0] to-[#138808]/15" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#FF9933]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#138808]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#000080]/10 rounded-full blur-2xl" />
          {/* Tricolor stripes */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-4 bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20 hover:bg-[#FF9933]/20">
                {t('heroSubtitle')}
              </Badge>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                <span className="text-[#FF9933]">{t('heroSlogan').split(' ')[0]}</span>{' '}
                <span className="text-[#138808]">{t('heroSlogan').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                {t('heroTagline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() => scrollTo('cta')}
                >
                  {t('heroCta')}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#138808] text-[#138808] hover:bg-[#138808]/10 px-8 text-lg rounded-full"
                  onClick={() => scrollTo('vision')}
                >
                  {t('heroLearnMore')}
                </Button>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-banner.png"
                  alt="Youth Rally"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000080]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-medium opacity-90">YHAM</p>
                  <p className="text-lg font-bold">{t('heroSlogan')}</p>
                </div>
              </div>
              {/* Decorative tricolor accent */}
              <div className="absolute -bottom-2 -left-2 -right-2 h-3 rounded-b-2xl bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            </motion.div>
          </div>
        </div>
      </section>}

      {/* Vision & Mission Section */}
      {isSectionVisible('vision') && <SectionWrapper id="vision" className="bg-gradient-to-b from-white to-[#FFF8F0]">
        <SectionHeader title={t('visionTitle')} icon={<Eye className="w-6 h-6" />} />
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title={t('visionHeading')}
            description={t('visionText')}
            color="saffron"
            delay={0}
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title={t('missionHeading')}
            description={t('missionText')}
            color="green"
            delay={0.2}
          />
        </div>
      </SectionWrapper>}

      {/* HAM Leadership Section */}
      {isSectionVisible('ham-leadership') && <SectionWrapper id="ham-leadership" className="bg-[#000080]">
        <SectionHeader title={t('hamLeadershipTitle')} icon={<Landmark className="w-6 h-6" />} light />
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* HAM Leaders Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6">
                <img
                  src="/ham-leaders.jpg"
                  alt="HAM Leadership"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000080]/60 to-transparent" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <LeaderCard
                  name={t('hamPatronName')}
                  role={t('hamPatron')}
                  color="saffron"
                  delay={0}
                />
                <LeaderCard
                  name={t('hamPresidentName')}
                  role={t('hamPresident')}
                  color="green"
                  delay={0.2}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>}

      {/* YHAM Leadership Section */}
      {isSectionVisible('yham-leadership') && <SectionWrapper id="leadership" className="bg-gradient-to-b from-[#FFF8F0] to-white">
        <SectionHeader title={t('yhamLeadershipTitle')} icon={<Award className="w-6 h-6" />} />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Youth President - Kamal Parvez */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            className="md:col-span-1 md:row-span-2"
          >
            <Card className="h-full border-2 border-[#FF9933]/30 hover:border-[#FF9933] transition-all hover:shadow-xl overflow-hidden group">
              <div className="bg-gradient-to-br from-[#FF9933]/20 to-[#FF9933]/5 p-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FF9933]/50 shadow-lg mb-4">
                  <img
                    src="/youth-leader.png"
                    alt="Kamal Parvez - Youth President"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#000080]">{t('youthPresidentName')}</h3>
                <Badge className="mt-2 bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20">
                  {t('youthPresident')}
                </Badge>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-[#138808]" />
                  <a href="tel:+919431877286" className="hover:text-[#FF9933] transition-colors">
                    +91-9431877286
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vice President */}
          <LeaderCardExtended
            name={t('youthVicePresidentName')}
            role={t('youthVicePresident')}
            phone="+91-8606287838"
            proposedBy
            color="green"
            delay={0.2}
          />

          {/* General Secretary */}
          <LeaderCardExtended
            name={t('youthGenSecretaryName')}
            role={t('youthGenSecretaryRole')}
            phone="+91-7012693572"
            proposedBy
            color="navy"
            delay={0.4}
          />
        </div>
      </SectionWrapper>}

      {/* Grassroots Organization Section */}
      {isSectionVisible('grassroots') && <SectionWrapper id="grassroots" className="bg-gradient-to-b from-white to-[#F0FFF0]">
        <SectionHeader title={t('grassrootsTitle')} icon={<Building2 className="w-6 h-6" />} />
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Structure */}
          <div>
            <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9933]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#FF9933]" />
              </div>
              {t('structureHeading')}
            </h3>
            <div className="space-y-4">
              <StructureCard
                level="1"
                title={t('villageCommittee')}
                description={t('villageDesc')}
                color="saffron"
                delay={0}
              />
              <StructureCard
                level="2"
                title={t('blockCommittee')}
                description={t('blockDesc')}
                color="white"
                delay={0.15}
              />
              <StructureCard
                level="3"
                title={t('districtCommittee')}
                description={t('districtDesc')}
                color="green"
                delay={0.3}
              />
            </div>
          </div>

          {/* Membership Campaign */}
          <div>
            <h3 className="text-2xl font-bold text-[#000080] mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#138808]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#138808]" />
              </div>
              {t('membershipHeading')}
            </h3>
            <div className="space-y-4">
              <MembershipCard
                icon={<Globe className="w-6 h-6" />}
                text={t('membershipOnline')}
                color="saffron"
                delay={0}
              />
              <MembershipCard
                icon={<GraduationCap className="w-6 h-6" />}
                text={t('membershipCampus')}
                color="green"
                delay={0.15}
              />
              <MembershipCard
                icon={<Heart className="w-6 h-6" />}
                text={t('membershipInclusive')}
                color="navy"
                delay={0.3}
              />
            </div>
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg">
              <img
                src="/grassroots.png"
                alt="Grassroots Development"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>}

      {/* Opportunities Section */}
      {isSectionVisible('opportunities') && <SectionWrapper id="opportunities" className="bg-gradient-to-b from-[#F0FFF0] to-white">
        <SectionHeader title={t('opportunitiesTitle')} icon={<Lightbulb className="w-6 h-6" />} />
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Local Issues */}
          <div>
            <h3 className="text-xl font-bold text-[#000080] mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9933]/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#FF9933]" />
              </div>
              {t('localIssuesHeading')}
            </h3>
            <div className="space-y-4">
              <ListItem text={t('localIssue1')} color="saffron" delay={0} />
              <ListItem text={t('localIssue2')} color="green" delay={0.1} />
              <ListItem text={t('localIssue3')} color="navy" delay={0.2} />
            </div>
          </div>

          {/* Skill Development */}
          <div>
            <h3 className="text-xl font-bold text-[#000080] mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#138808]/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#138808]" />
              </div>
              {t('skillHeading')}
            </h3>
            <div className="space-y-4">
              <ListItem text={t('skill1')} color="green" delay={0} />
              <ListItem text={t('skill2')} color="saffron" delay={0.1} />
              <ListItem text={t('skill3')} color="navy" delay={0.2} />
            </div>
          </div>
        </div>
      </SectionWrapper>}

      {/* National Presence Section */}
      {isSectionVisible('national') && <SectionWrapper id="national" className="bg-gradient-to-b from-white to-[#F0F0FF]">
        <SectionHeader title={t('nationalTitle')} icon={<Tv className="w-6 h-6" />} />
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title={t('digitalHeading')}
            description={`${t('digital1')}\n${t('digital2')}\n${t('digital3')}`}
            color="saffron"
            delay={0}
          />
          <FeatureCard
            icon={<Megaphone className="w-8 h-8" />}
            title={t('eventsHeading')}
            description={`${t('event1')}\n${t('event2')}`}
            color="green"
            delay={0.2}
          />
          <FeatureCard
            icon={<Tv className="w-8 h-8" />}
            title={t('mediaHeading')}
            description={`${t('media1')}\n${t('media2')}\n${t('media3')}`}
            color="navy"
            delay={0.4}
          />
          <FeatureCard
            icon={<Award className="w-8 h-8" />}
            title={t('brandingHeading')}
            description={`${t('branding1')}\n${t('branding2')}\n${t('branding3')}`}
            color="green"
            delay={0.6}
          />
        </div>
      </SectionWrapper>}

      {/* Collaboration Section */}
      {isSectionVisible('collaboration') && <SectionWrapper id="collaboration" className="bg-gradient-to-b from-[#F0F0FF] to-white">
        <SectionHeader title={t('collaborationTitle')} icon={<Handshake className="w-6 h-6" />} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <CollabCard
            icon={<Heart className="w-8 h-8" />}
            title={t('collabNGO')}
            description={t('collabNGODesc')}
            color="saffron"
            delay={0}
          />
          <CollabCard
            icon={<GraduationCap className="w-8 h-8" />}
            title={t('collabAcademic')}
            description={t('collabAcademicDesc')}
            color="green"
            delay={0.15}
          />
          <CollabCard
            icon={<Briefcase className="w-8 h-8" />}
            title={t('collabCorporate')}
            description={t('collabCorporateDesc')}
            color="navy"
            delay={0.3}
          />
          <CollabCard
            icon={<Users className="w-8 h-8" />}
            title={t('collabYouth')}
            description={t('collabYouthDesc')}
            color="saffron"
            delay={0.45}
          />
        </div>
      </SectionWrapper>}

      {/* Monitoring, Funding & Code of Conduct */}
      {isSectionVisible('monitoring') && <SectionWrapper id="monitoring" className="bg-gradient-to-b from-white to-[#FFF8F0]">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Monitoring */}
          <div>
            <h3 className="text-xl font-bold text-[#000080] mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9933]/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#FF9933]" />
              </div>
              {t('monitoringTitle')}
            </h3>
            <div className="space-y-3">
              <ListItem text={t('monitor1')} color="saffron" delay={0} />
              <ListItem text={t('monitor2')} color="green" delay={0.1} />
              <ListItem text={t('monitor3')} color="navy" delay={0.2} />
              <ListItem text={t('monitor4')} color="saffron" delay={0.3} />
            </div>
          </div>

          {/* Funding */}
          <div>
            <h3 className="text-xl font-bold text-[#000080] mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#138808]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#138808]" />
              </div>
              {t('fundingTitle')}
            </h3>
            <div className="space-y-3">
              <ListItem text={t('fund1')} color="green" delay={0} />
              <ListItem text={t('fund2')} color="saffron" delay={0.1} />
              <ListItem text={t('fund3')} color="navy" delay={0.2} />
              <ListItem text={t('fund4')} color="green" delay={0.3} />
            </div>
          </div>

          {/* Code of Conduct */}
          <div>
            <h3 className="text-xl font-bold text-[#000080] mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#000080]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#000080]" />
              </div>
              {t('conductTitle')}
            </h3>
            <div className="space-y-3">
              <ListItem text={t('conduct1')} color="navy" delay={0} />
              <ListItem text={t('conduct2')} color="saffron" delay={0.1} />
              <ListItem text={t('conduct3')} color="green" delay={0.2} />
            </div>
          </div>
        </div>
      </SectionWrapper>}

      {/* Call to Action Section */}
      {isSectionVisible('cta') && <section id="cta" className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933] via-[#000080] to-[#138808]" />
        <div className="absolute inset-0 bg-[#000080]/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-10">
              {t('ctaSubtitle')}
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8">
              <h3 className="text-xl font-bold text-[#FF9933] mb-6">{t('ctaMembership')}</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white/70 text-sm">{t('ctaWebsite')}</p>
                  <a href="https://www.yham.in" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#FF9933] transition-colors">
                    www.yham.in
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white/70 text-sm">{t('ctaEmail')}</p>
                  <a href="mailto:join@yham.in" className="text-white font-semibold hover:text-[#FF9933] transition-colors">
                    join@yham.in
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-white/70 text-sm">{t('ctaPhone')}</p>
                  <a href="tel:+918606287838" className="text-white font-semibold hover:text-[#FF9933] transition-colors">
                    +91-8606287838
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-white/70 text-lg">{t('ctaClosing')}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#FF9933]">
                &ldquo;{t('ctaClosingSlogan')}&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>}

      {/* Footer */}
      <footer className="bg-[#000080] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#000080] flex items-center justify-center text-white font-bold text-xs">
                    YH
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('orgShortName')}</h3>
                  <p className="text-sm text-white/60">{t('footerTagline')}</p>
                </div>
              </div>
              <p className="text-white/50 text-sm">{t('heroTagline')}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footerQuickLinks')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollTo(item.id)}
                    className="text-left text-white/60 hover:text-[#FF9933] transition-colors text-sm py-1"
                  >
                    {t(item.key)}
                  </button>
                ))}
                <Link href="/admin" className="text-left text-white/40 hover:text-[#FF9933] transition-colors text-xs py-1 mt-2 block">
                  Admin Panel
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('navContact')}</h3>
              <div className="space-y-3 text-sm text-white/60">
                <a href="tel:+919431877286" className="flex items-center gap-2 hover:text-[#FF9933] transition-colors">
                  <Phone className="w-4 h-4" /> +91-9431877286 (Youth President)
                </a>
                <a href="tel:+918606287838" className="flex items-center gap-2 hover:text-[#FF9933] transition-colors">
                  <Phone className="w-4 h-4" /> +91-8606287838 (Youth Vice President)
                </a>
                <a href="tel:+917012693572" className="flex items-center gap-2 hover:text-[#FF9933] transition-colors">
                  <Phone className="w-4 h-4" /> +91-7012693572 (Youth Gen. Secretary)
                </a>
                <a href="mailto:join@yham.in" className="flex items-center gap-2 hover:text-[#FF9933] transition-colors">
                  <Mail className="w-4 h-4" /> join@yham.in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} {t('orgName')}. {t('footerRights')}.
            </p>
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#FF9933] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:bg-[#FF9933]/90"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== Reusable Components ==========

function SectionWrapper({ id, className, children, sectionKey }: { id: string; className?: string; children: React.ReactNode; sectionKey?: string }) {
  // Visibility will be checked by parent using isSectionVisible
  return (
    <section id={id} className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  )
}

function SectionHeader({ title, icon, light }: { title: string; icon: React.ReactNode; light?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div className={`inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full ${
        light ? 'bg-white/10 text-white' : 'bg-[#FF9933]/10 text-[#FF9933]'
      }`}>
        {icon}
        <span className="text-sm font-semibold tracking-wide uppercase">{title}</span>
      </div>
      <h2 className={`text-3xl sm:text-4xl font-extrabold ${light ? 'text-white' : 'text-[#000080]'}`}>
        {title}
      </h2>
      <div className={`mt-4 mx-auto h-1 w-20 rounded-full ${
        light ? 'bg-gradient-to-r from-[#FF9933] via-white to-[#138808]' : 'bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808]'
      }`} />
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, color, delay }: {
  icon: React.ReactNode; title: string; description: string; color: 'saffron' | 'green' | 'navy'; delay: number
}) {
  const colorMap = {
    saffron: { bg: 'bg-[#FF9933]/10', text: 'text-[#FF9933]', border: 'hover:border-[#FF9933]', iconBg: 'bg-[#FF9933]/10' },
    green: { bg: 'bg-[#138808]/10', text: 'text-[#138808]', border: 'hover:border-[#138808]', iconBg: 'bg-[#138808]/10' },
    navy: { bg: 'bg-[#000080]/10', text: 'text-[#000080]', border: 'hover:border-[#000080]', iconBg: 'bg-[#000080]/10' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`h-full border-2 border-transparent ${c.border} transition-all hover:shadow-lg`}>
        <CardContent className="p-6">
          <div className={`w-14 h-14 rounded-xl ${c.iconBg} flex items-center justify-center mb-4 ${c.text}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold mb-3 ${c.text}`}>{title}</h3>
          <div className="space-y-2">
            {description.split('\n').map((line, i) => (
              <p key={i} className="text-gray-600 flex items-start gap-2">
                <span className={`inline-block w-2 h-2 rounded-full mt-2 shrink-0 ${
                  color === 'saffron' ? 'bg-[#FF9933]' : color === 'green' ? 'bg-[#138808]' : 'bg-[#000080]'
                }`} />
                {line}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LeaderCard({ name, role, color, delay }: {
  name: string; role: string; color: 'saffron' | 'green'; delay: number
}) {
  const colorMap = {
    saffron: { bg: 'bg-[#FF9933]/20', text: 'text-[#FF9933]', badge: 'bg-[#FF9933]/20 text-[#FF9933] border-[#FF9933]/30' },
    green: { bg: 'bg-[#138808]/20', text: 'text-[#138808]', badge: 'bg-[#138808]/20 text-[#138808] border-[#138808]/30' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`${c.bg} rounded-xl p-6 text-center backdrop-blur-sm`}>
        <Badge className={`mb-3 ${c.badge}`}>{role}</Badge>
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>
    </motion.div>
  )
}

function LeaderCardExtended({ name, role, phone, proposedBy, color, delay }: {
  name: string; role: string; phone: string; proposedBy?: boolean; color: 'saffron' | 'green' | 'navy'; delay: number
}) {
  const colorMap = {
    saffron: { border: 'border-[#FF9933]/30 hover:border-[#FF9933]', badge: 'bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/20' },
    green: { border: 'border-[#138808]/30 hover:border-[#138808]', badge: 'bg-[#138808]/10 text-[#138808] border-[#138808]/20' },
    navy: { border: 'border-[#000080]/30 hover:border-[#000080]', badge: 'bg-[#000080]/10 text-[#000080] border-[#000080]/20' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className={`h-full border-2 ${c.border} transition-all hover:shadow-lg`}>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933]/20 via-white to-[#138808]/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#000080]" />
          </div>
          <h3 className="text-lg font-bold text-[#000080]">{name}</h3>
          <Badge className={`mt-2 ${c.badge}`}>{role}</Badge>
          {proposedBy && (
            <p className="text-xs text-gray-400 mt-1">YHAM</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-[#138808]" />
            <a href={`tel:${phone.replace(/-/g, '')}`} className="hover:text-[#FF9933] transition-colors">
              {phone}
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StructureCard({ level, title, description, color, delay }: {
  level: string; title: string; description: string; color: 'saffron' | 'white' | 'green'; delay: number
}) {
  const colorMap = {
    saffron: { accent: 'bg-[#FF9933]', text: 'text-[#FF9933]', lightBg: 'bg-[#FF9933]/5' },
    white: { accent: 'bg-gray-400', text: 'text-gray-600', lightBg: 'bg-gray-50' },
    green: { accent: 'bg-[#138808]', text: 'text-[#138808]', lightBg: 'bg-[#138808]/5' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`flex items-start gap-4 p-4 rounded-xl ${c.lightBg} border border-transparent hover:border-gray-200 transition-all`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-lg ${c.accent} flex items-center justify-center text-white font-bold text-sm`}>
        {level}
      </div>
      <div>
        <h4 className={`font-bold ${c.text}`}>{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </motion.div>
  )
}

function MembershipCard({ icon, text, color, delay }: {
  icon: React.ReactNode; text: string; color: 'saffron' | 'green' | 'navy'; delay: number
}) {
  const colorMap = {
    saffron: { bg: 'bg-[#FF9933]/10', text: 'text-[#FF9933]' },
    green: { bg: 'bg-[#138808]/10', text: 'text-[#138808]' },
    navy: { bg: 'bg-[#000080]/10', text: 'text-[#000080]' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
    >
      <div className={`shrink-0 w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}>
        {icon}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </motion.div>
  )
}

function ListItem({ text, color, delay }: { text: string; color: 'saffron' | 'green' | 'navy'; delay: number }) {
  const colorMap = {
    saffron: 'bg-[#FF9933]',
    green: 'bg-[#138808]',
    navy: 'bg-[#000080]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-3"
    >
      <div className={`shrink-0 w-2 h-2 rounded-full ${colorMap[color]} mt-2`} />
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </motion.div>
  )
}

function CollabCard({ icon, title, description, color, delay }: {
  icon: React.ReactNode; title: string; description: string; color: 'saffron' | 'green' | 'navy'; delay: number
}) {
  const colorMap = {
    saffron: { iconBg: 'bg-[#FF9933]/10', iconText: 'text-[#FF9933]', border: 'hover:border-[#FF9933]' },
    green: { iconBg: 'bg-[#138808]/10', iconText: 'text-[#138808]', border: 'hover:border-[#138808]' },
    navy: { iconBg: 'bg-[#000080]/10', iconText: 'text-[#000080]', border: 'hover:border-[#000080]' },
  }
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`h-full border-2 border-transparent ${c.border} transition-all hover:shadow-lg text-center`}>
        <CardContent className="p-6">
          <div className={`w-14 h-14 rounded-xl ${c.iconBg} flex items-center justify-center mx-auto mb-4 ${c.iconText}`}>
            {icon}
          </div>
          <h3 className="font-bold text-[#000080] mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
