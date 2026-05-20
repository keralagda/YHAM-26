'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Save,
  Loader2,
  Menu,
  X,
  Globe,
  FileText,
  Users,
  Megaphone,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SiteSection {
  id: string
  sectionKey: string
  label: string
  order: number
  visible: boolean
  sectionType: string
  contentHi: string
  contentEn: string
  contentMl: string
  createdAt: string
  updatedAt: string
}

type SectionType = 'hero' | 'content' | 'leadership' | 'cta'

// ─── Constants ───────────────────────────────────────────────────────────────

const BRAND_SAFFRON = '#FF9933'
const BRAND_GREEN = '#138808'
const BRAND_NAVY = '#000080'

const SECTION_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  hero: {
    label: 'Hero',
    icon: <Megaphone className="size-3" />,
    color: BRAND_SAFFRON,
  },
  content: {
    label: 'Content',
    icon: <FileText className="size-3" />,
    color: BRAND_GREEN,
  },
  leadership: {
    label: 'Leadership',
    icon: <Users className="size-3" />,
    color: BRAND_NAVY,
  },
  cta: {
    label: 'CTA',
    icon: <Megaphone className="size-3" />,
    color: BRAND_SAFFRON,
  },
}

const LANGUAGE_CONFIG = [
  { key: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { key: 'en', label: 'English', flag: '🌐' },
  { key: 'ml', label: 'Malayalam', flag: '🏛️' },
] as const

type LanguageKey = 'hi' | 'en' | 'ml'
type ContentMap = Record<string, string>

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseContent(jsonStr: string): ContentMap {
  try {
    return JSON.parse(jsonStr) as ContentMap
  } catch {
    return {}
  }
}

function isLongText(value: string): boolean {
  return value.length > 60
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { toast } = useToast()

  // ── State ────────────────────────────────────────────────────────────────
  const [sections, setSections] = useState<SiteSection[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Edit state
  const [editLabel, setEditLabel] = useState('')
  const [editSectionType, setEditSectionType] = useState<string>('content')
  const [editContentHi, setEditContentHi] = useState<ContentMap>({})
  const [editContentEn, setEditContentEn] = useState<ContentMap>({})
  const [editContentMl, setEditContentMl] = useState<ContentMap>({})
  const [activeLang, setActiveLang] = useState<string>('en')
  const [hasChanges, setHasChanges] = useState(false)

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState<SectionType>('content')
  const [adding, setAdding] = useState(false)

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/site-content')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setSections(data)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load sections', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // ── Selection ────────────────────────────────────────────────────────────

  const selectedSection = sections.find((s) => s.id === selectedId) || null

  useEffect(() => {
    if (selectedSection) {
      setEditLabel(selectedSection.label)
      setEditSectionType(selectedSection.sectionType)
      setEditContentHi(parseContent(selectedSection.contentHi))
      setEditContentEn(parseContent(selectedSection.contentEn))
      setEditContentMl(parseContent(selectedSection.contentMl))
      setHasChanges(false)
    }
  }, [selectedSection])

  // ── Track changes ────────────────────────────────────────────────────────

  const updateContentField = (lang: LanguageKey, key: string, value: string) => {
    setHasChanges(true)
    if (lang === 'hi') setEditContentHi((prev) => ({ ...prev, [key]: value }))
    else if (lang === 'en') setEditContentEn((prev) => ({ ...prev, [key]: value }))
    else setEditContentMl((prev) => ({ ...prev, [key]: value }))
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/site-content/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: editLabel,
          sectionType: editSectionType,
          contentHi: JSON.stringify(editContentHi),
          contentEn: JSON.stringify(editContentEn),
          contentMl: JSON.stringify(editContentMl),
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast({ title: 'Saved!', description: 'Section updated successfully' })
      setHasChanges(false)
      fetchSections()
    } catch {
      toast({ title: 'Error', description: 'Failed to save section', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle visibility ────────────────────────────────────────────────────

  const handleToggleVisible = async (section: SiteSection) => {
    try {
      const newVisible = !section.visible
      await fetch(`/api/site-content/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: newVisible }),
      })
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, visible: newVisible } : s))
      )
      toast({
        title: newVisible ? 'Section visible' : 'Section hidden',
        description: `${section.label} is now ${newVisible ? 'visible' : 'hidden'}`,
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to toggle visibility', variant: 'destructive' })
    }
  }

  // ── Reorder ──────────────────────────────────────────────────────────────

  const handleReorder = async (section: SiteSection, direction: 'up' | 'down') => {
    const idx = sections.findIndex((s) => s.id === section.id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sections.length) return

    const updated = [...sections]
    const tempOrder = updated[idx].order
    updated[idx] = { ...updated[idx], order: updated[swapIdx].order }
    updated[swapIdx] = { ...updated[swapIdx], order: tempOrder }

    setSections(updated.sort((a, b) => a.order - b.order))

    try {
      await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: updated.map((s) => ({ id: s.id, order: s.order, visible: s.visible })),
        }),
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' })
      fetchSections()
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────

  const handleDelete = async (section: SiteSection) => {
    try {
      await fetch(`/api/site-content/${section.id}`, { method: 'DELETE' })
      if (selectedId === section.id) setSelectedId(null)
      toast({ title: 'Deleted', description: `${section.label} has been removed` })
      fetchSections()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete section', variant: 'destructive' })
    }
  }

  // ── Seed ─────────────────────────────────────────────────────────────────

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await fetch('/api/site-content/seed', { method: 'POST' })
      toast({ title: 'Data seeded', description: 'All sections reset to defaults' })
      setSelectedId(null)
      fetchSections()
    } catch {
      toast({ title: 'Error', description: 'Failed to seed data', variant: 'destructive' })
    } finally {
      setSeeding(false)
    }
  }

  // ── Add section ──────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!newKey.trim() || !newLabel.trim()) return
    setAdding(true)
    try {
      const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), -1)
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: newKey.trim(),
          label: newLabel.trim(),
          order: maxOrder + 1,
          visible: true,
          sectionType: newType,
          contentHi: {},
          contentEn: {},
          contentMl: {},
        }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create')
      }
      toast({ title: 'Created!', description: `${newLabel} section added` })
      setNewKey('')
      setNewLabel('')
      setNewType('content')
      setAddDialogOpen(false)
      fetchSections()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create section',
        variant: 'destructive',
      })
    } finally {
      setAdding(false)
    }
  }

  // ── Render content editor for a language ─────────────────────────────────

  const renderContentEditor = (lang: LanguageKey) => {
    const content = lang === 'hi' ? editContentHi : lang === 'en' ? editContentEn : editContentMl
    const keys = Object.keys(content)

    if (keys.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <FileText className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No content fields yet.</p>
          <p className="text-xs mt-1">Seed data to populate default translations.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {keys.map((key) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-1.5"
          >
            <Label
              htmlFor={`${lang}-${key}`}
              className="text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {key}
            </Label>
            {isLongText(content[key]) ? (
              <Textarea
                id={`${lang}-${key}`}
                value={content[key]}
                onChange={(e) => updateContentField(lang, key, e.target.value)}
                rows={3}
                className="resize-y bg-white border-gray-200 focus:border-[#FF9933] focus:ring-[#FF9933]/20"
              />
            ) : (
              <Input
                id={`${lang}-${key}`}
                value={content[key]}
                onChange={(e) => updateContentField(lang, key, e.target.value)}
                className="bg-white border-gray-200 focus:border-[#FF9933] focus:ring-[#FF9933]/20"
              />
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  // ── Section list item ────────────────────────────────────────────────────

  const renderSectionItem = (section: SiteSection, idx: number) => {
    const isSelected = selectedId === section.id
    const typeConfig = SECTION_TYPE_CONFIG[section.sectionType] || SECTION_TYPE_CONFIG.content

    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, delay: idx * 0.03 }}
        className={`
          group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
          transition-all duration-150 border border-transparent
          ${isSelected
            ? 'bg-white/10 border-white/20 shadow-sm'
            : 'hover:bg-white/5'
          }
        `}
        onClick={() => {
          setSelectedId(section.id)
          setSidebarOpen(false)
        }}
      >
        {/* Drag indicator / order */}
        <span className="text-xs text-gray-500 w-5 text-center font-mono">{section.order + 1}</span>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
              {section.label}
            </span>
            <Badge
              variant="outline"
              className="shrink-0 text-[10px] px-1.5 py-0 h-4"
              style={{ borderColor: typeConfig.color, color: typeConfig.color }}
            >
              {typeConfig.label}
            </Badge>
          </div>
          {!section.visible && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hidden</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Visibility toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleVisible(section)
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? (
              <Eye className="size-3.5 text-gray-400" />
            ) : (
              <EyeOff className="size-3.5 text-gray-600" />
            )}
          </button>

          {/* Reorder */}
          <div className="flex flex-col">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReorder(section, 'up')
              }}
              disabled={idx === 0}
              className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
            >
              <ChevronUp className="size-3 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleReorder(section, 'down')
              }}
              disabled={idx === sections.length - 1}
              className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-colors"
            >
              <ChevronDown className="size-3 text-gray-400" />
            </button>
          </div>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="size-3.5 text-red-400" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{section.label}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the section and all its content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(section)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    )
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white hover:bg-white/10">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900 border-gray-800 p-0 w-72">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle className="text-white text-left">Sections</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="p-3 space-y-1">
                  {sections.map((section, idx) => renderSectionItem(section, idx))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${BRAND_SAFFRON}, ${BRAND_GREEN})` }}
            >
              <img src="/logo.svg" alt="YHAM" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">YHAM Site Builder</h1>
              <p className="text-gray-500 text-[10px] leading-tight">Content Management Panel</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Seed Data */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
            className="hidden sm:flex border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 hover:border-gray-600"
          >
            {seeding ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <RefreshCw className="size-3.5 mr-1.5" />}
            Seed Data
          </Button>

          {/* Preview Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md font-medium transition-colors"
            style={{ backgroundColor: BRAND_GREEN, color: 'white' }}
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden sm:inline">Preview Site</span>
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar (desktop) ─────────────────────────────────────────────── */}
        <aside className="hidden md:flex w-80 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
          {/* Section header */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Sections ({sections.length})
              </h2>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="h-7 text-xs gap-1"
                    style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}
                  >
                    <Plus className="size-3" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                    <DialogDescription>
                      Create a new content section for the website.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-key">Section Key</Label>
                      <Input
                        id="new-key"
                        placeholder="e.g., about-us"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">Unique identifier (lowercase, hyphens allowed)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-label">Label</Label>
                      <Input
                        id="new-label"
                        placeholder="e.g., About Us"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Section Type</Label>
                      <Select value={newType} onValueChange={(v) => setNewType(v as SectionType)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="cta">Call to Action</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAdd}
                      disabled={!newKey.trim() || !newLabel.trim() || adding}
                      style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}
                    >
                      {adding ? <Loader2 className="size-4 animate-spin mr-1" /> : <Plus className="size-4 mr-1" />}
                      Create Section
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile-only seed button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeed}
              disabled={seeding}
              className="w-full sm:hidden mb-2 border-gray-700 text-gray-300 hover:text-white hover:bg-white/10"
            >
              {seeding ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <RefreshCw className="size-3.5 mr-1.5" />}
              Seed Data
            </Button>
          </div>

          <Separator className="bg-gray-800" />

          {/* Section list */}
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-gray-500" />
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <FileText className="size-10 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">No sections yet</p>
                <p className="text-gray-600 text-xs mt-1">Click &quot;Seed Data&quot; or &quot;Add&quot; to get started</p>
              </div>
            ) : (
              <div className="p-3 space-y-0.5">
                {sections.map((section, idx) => renderSectionItem(section, idx))}
              </div>
            )}
          </ScrollArea>

          {/* Sidebar footer */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <Settings className="size-3" />
              <span>Drag to reorder &bull; Toggle visibility</span>
            </div>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!selectedSection ? (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `linear-gradient(135deg, ${BRAND_SAFFRON}20, ${BRAND_GREEN}20)` }}
                >
                  <Globe className="size-10" style={{ color: BRAND_SAFFRON }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Section
                </h2>
                <p className="text-gray-400 max-w-md text-sm">
                  Choose a section from the sidebar to edit its content across all languages.
                  Use the controls to reorder, toggle visibility, or delete sections.
                </p>
                {sections.length === 0 && (
                  <Button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="mt-6 gap-2"
                    style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}
                  >
                    {seeding ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    Seed Default Data
                  </Button>
                )}
              </motion.div>
            ) : (
              /* Editor */
              <motion.div
                key={selectedSection.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8"
              >
                {/* Editor header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: SECTION_TYPE_CONFIG[editSectionType]?.color || BRAND_GREEN,
                          color: SECTION_TYPE_CONFIG[editSectionType]?.color || BRAND_GREEN,
                        }}
                      >
                        {SECTION_TYPE_CONFIG[editSectionType]?.icon}
                        {SECTION_TYPE_CONFIG[editSectionType]?.label || editSectionType}
                      </Badge>
                      <span className="text-xs text-gray-400 font-mono">{selectedSection.sectionKey}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        value={editLabel}
                        onChange={(e) => {
                          setEditLabel(e.target.value)
                          setHasChanges(true)
                        }}
                        className="text-xl font-bold border-0 p-0 h-auto shadow-none focus:ring-0 bg-transparent text-gray-800"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {new Date(selectedSection.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Section type selector */}
                    <Select value={editSectionType} onValueChange={(v) => { setEditSectionType(v); setHasChanges(true) }}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="cta">Call to Action</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Visibility */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Switch
                        checked={selectedSection.visible}
                        onCheckedChange={() => handleToggleVisible(selectedSection)}
                      />
                      <span className="hidden sm:inline">{selectedSection.visible ? 'Visible' : 'Hidden'}</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Language tabs */}
                <Tabs value={activeLang} onValueChange={setActiveLang} className="w-full">
                  <TabsList className="mb-4">
                    {LANGUAGE_CONFIG.map((lang) => (
                      <TabsTrigger key={lang.key} value={lang.key} className="gap-1.5">
                        <span className="text-sm">{lang.flag}</span>
                        {lang.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {LANGUAGE_CONFIG.map((lang) => (
                    <TabsContent key={lang.key} value={lang.key}>
                      <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            {lang.label} Content
                            <span className="text-xs text-gray-400 font-normal">
                              ({Object.keys(
                                lang.key === 'hi' ? editContentHi : lang.key === 'en' ? editContentEn : editContentMl
                              ).length} fields)
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderContentEditor(lang.key as LanguageKey)}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Save bar */}
                <motion.div
                  initial={false}
                  animate={hasChanges ? { y: 0, opacity: 1 } : { y: 8, opacity: 0.6 }}
                  className={`sticky bottom-4 mt-6 flex items-center justify-between p-4 rounded-xl border shadow-lg transition-all ${
                    hasChanges
                      ? 'bg-white border-[#FF9933]/30 shadow-[#FF9933]/10'
                      : 'bg-gray-50 border-gray-200 shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    {hasChanges ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                        <span className="text-gray-600 font-medium">Unsaved changes</span>
                      </>
                    ) : (
                      <span className="text-gray-400">All changes saved</span>
                    )}
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="gap-2 min-w-[120px]"
                    style={hasChanges ? { backgroundColor: BRAND_SAFFRON, color: '#000' } : {}}
                  >
                    {saving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
