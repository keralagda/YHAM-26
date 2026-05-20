'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Save, Eye, EyeOff, GripVertical, ArrowLeft,
  FileText, Image, Users, Video, Layout, Type, Phone, BarChart3,
  Columns, Minus, Globe, Loader2, ExternalLink, Copy, Settings2,
  Palette, PanelLeft, Megaphone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ImageUploader } from '@/components/ui/image-uploader'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageData {
  id: string
  slug: string
  titleHi: string
  titleEn: string
  titleMl: string
  description: string
  template: string
  theme: string
  published: boolean
  isHomePage: boolean
  order: number
  blocks: BlockData[]
}

interface BlockData {
  id: string
  pageId: string
  type: string
  order: number
  visible: boolean
  content: string
  settings: string
}

// ─── Block Type Registry ─────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Banner', icon: <Megaphone className="size-4" />, category: 'layout', description: 'Full-width hero with title, subtitle, and CTA' },
  { type: 'text', label: 'Text Content', icon: <Type className="size-4" />, category: 'content', description: 'Rich text block with heading and body' },
  { type: 'leaders', label: 'Leader Cards', icon: <Users className="size-4" />, category: 'leadership', description: 'Grid of leader/member cards with photos' },
  { type: 'gallery', label: 'Image Gallery', icon: <Image className="size-4" />, category: 'media', description: 'Grid or carousel of images' },
  { type: 'video', label: 'Video Embed', icon: <Video className="size-4" />, category: 'media', description: 'YouTube or uploaded video' },
  { type: 'cta', label: 'Call to Action', icon: <Phone className="size-4" />, category: 'layout', description: 'Action section with buttons and contact info' },
  { type: 'stats', label: 'Statistics', icon: <BarChart3 className="size-4" />, category: 'content', description: 'Number counters and achievements' },
  { type: 'columns', label: 'Columns', icon: <Columns className="size-4" />, category: 'layout', description: '2 or 3 column layout with content' },
  { type: 'spacer', label: 'Spacer', icon: <Minus className="size-4" />, category: 'layout', description: 'Vertical spacing between blocks' },
  { type: 'contact', label: 'Contact Form', icon: <FileText className="size-4" />, category: 'content', description: 'Contact form with fields' },
]

const THEMES = [
  { id: 'saffron', label: 'Saffron (YHAM)', colors: ['#FF9933', '#FFF8F0'] },
  { id: 'red-white', label: 'Red & White (HAM)', colors: ['#DC2626', '#FEF2F2'] },
  { id: 'navy', label: 'Navy Blue', colors: ['#000080', '#F0F0FF'] },
  { id: 'green', label: 'Green', colors: ['#138808', '#F0FFF0'] },
]

const TEMPLATES = [
  { id: 'default', label: 'Standard Page' },
  { id: 'fullwidth', label: 'Full Width' },
  { id: 'landing', label: 'Landing Page' },
]

// ─── Main Page Builder Component ─────────────────────────────────────────────

export default function PageBuilderAdmin() {
  const { toast } = useToast()
  const [pages, setPages] = useState<PageData[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showNewPage, setShowNewPage] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'page' | 'block'; id: string } | null>(null)

  // New page form
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newTemplate, setNewTemplate] = useState('default')
  const [newTheme, setNewTheme] = useState('saffron')

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pages')
      if (!res.ok) throw new Error()
      setPages(await res.json())
    } catch {
      toast({ title: 'Error', description: 'Failed to load pages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchPages() }, [fetchPages])

  const selectedPage = pages.find(p => p.id === selectedPageId) || null
  const selectedBlock = selectedPage?.blocks.find(b => b.id === selectedBlockId) || null

  // ─── Page CRUD ─────────────────────────────────────────────────────────────

  const handleCreatePage = async () => {
    if (!newSlug || !newTitle) return
    setSaving(true)
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: newSlug, titleEn: newTitle, template: newTemplate, theme: newTheme }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      toast({ title: 'Page created!' })
      setShowNewPage(false)
      setNewSlug(''); setNewTitle('')
      fetchPages()
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleUpdatePage = async (data: Partial<PageData>) => {
    if (!selectedPageId) return
    try {
      await fetch(`/api/pages/${selectedPageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      fetchPages()
    } catch {
      toast({ title: 'Error', description: 'Failed to update page', variant: 'destructive' })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      const url = deleteTarget.type === 'page' ? `/api/pages/${deleteTarget.id}` : `/api/blocks/${deleteTarget.id}`
      await fetch(url, { method: 'DELETE' })
      if (deleteTarget.type === 'page' && deleteTarget.id === selectedPageId) {
        setSelectedPageId(null)
        setSelectedBlockId(null)
      }
      if (deleteTarget.type === 'block' && deleteTarget.id === selectedBlockId) {
        setSelectedBlockId(null)
      }
      toast({ title: 'Deleted' })
      fetchPages()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' })
    } finally { setDeleteTarget(null) }
  }

  // ─── Block CRUD ────────────────────────────────────────────────────────────

  const handleAddBlock = async (type: string) => {
    if (!selectedPageId) return
    const maxOrder = selectedPage?.blocks.reduce((m, b) => Math.max(m, b.order), -1) ?? -1
    try {
      await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: selectedPageId, type, order: maxOrder + 1, content: {}, settings: {} }),
      })
      setShowAddBlock(false)
      fetchPages()
    } catch {
      toast({ title: 'Error', description: 'Failed to add block', variant: 'destructive' })
    }
  }

  const handleUpdateBlock = async (blockId: string, data: { content?: object; settings?: object; visible?: boolean }) => {
    setSaving(true)
    try {
      await fetch(`/api/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      fetchPages()
      toast({ title: 'Saved!' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save block', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
              <ArrowLeft className="size-4" /> Admin
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Layout className="size-5 text-red-600" />
            <h1 className="text-lg font-bold text-gray-800">Page Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedPage && (
            <>
              <Badge variant={selectedPage.published ? 'default' : 'secondary'} className={selectedPage.published ? 'bg-green-600' : ''}>
                {selectedPage.published ? 'Published' : 'Draft'}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => handleUpdatePage({ published: !selectedPage.published })}>
                {selectedPage.published ? <EyeOff className="size-4 mr-1" /> : <Eye className="size-4 mr-1" />}
                {selectedPage.published ? 'Unpublish' : 'Publish'}
              </Button>
              <a href={`/p/${selectedPage.slug}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1">
                  <ExternalLink className="size-3.5" /> Preview
                </Button>
              </a>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Pages List */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</h2>
              <Button size="sm" className="h-7 text-xs gap-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowNewPage(true)}>
                <Plus className="size-3" /> New
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-gray-400" /></div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <FileText className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No pages yet</p>
                  <p className="text-xs mt-1">Seed default pages or create new</p>
                  <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs" onClick={async () => { await fetch('/api/pages/seed', { method: 'POST' }); fetchPages() }}>
                    Seed Default Pages
                  </Button>
                </div>
              ) : pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => { setSelectedPageId(page.id); setSelectedBlockId(null) }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                    selectedPageId === page.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{page.titleEn}</span>
                    {page.published && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">/{page.slug}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Center - Block Canvas */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedPage ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Layout className="size-16 text-gray-200 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600">Select or create a page</h2>
              <p className="text-gray-400 mt-2 max-w-md">Choose a page from the sidebar to edit its blocks, or create a new page to get started.</p>
              <Button className="mt-6 bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowNewPage(true)}>
                <Plus className="size-4 mr-2" /> Create First Page
              </Button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Page Header */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{selectedPage.titleEn}</h2>
                      <p className="text-sm text-gray-400">/{selectedPage.slug} • {selectedPage.template} • {selectedPage.theme} theme</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowAddBlock(true)}>
                        <Plus className="size-3.5" /> Add Block
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteTarget({ type: 'page', id: selectedPage.id })}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blocks List */}
              {selectedPage.blocks.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                  <PanelLeft className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No blocks yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add blocks to build your page</p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowAddBlock(true)}>
                    <Plus className="size-4 mr-2" /> Add First Block
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPage.blocks.map((block, idx) => {
                    const blockType = BLOCK_TYPES.find(bt => bt.type === block.type)
                    const isSelected = selectedBlockId === block.id
                    return (
                      <motion.div
                        key={block.id}
                        layout
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          isSelected ? 'border-red-400 bg-red-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedBlockId(block.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                            {blockType?.icon || <FileText className="size-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-800">{blockType?.label || block.type}</span>
                              <Badge variant="outline" className="text-[10px] h-4">{block.type}</Badge>
                              {!block.visible && <Badge variant="secondary" className="text-[10px] h-4">Hidden</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="size-7" onClick={(e) => { e.stopPropagation(); handleUpdateBlock(block.id, { visible: !block.visible }) }}>
                              {block.visible ? <Eye className="size-3.5 text-gray-400" /> : <EyeOff className="size-3.5 text-gray-400" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="size-7 text-red-500" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'block', id: block.id }) }}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Panel - Block Editor or Page Settings */}
        {selectedBlock ? (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-800">Edit Block</h3>
              <p className="text-xs text-gray-400 mt-0.5">{BLOCK_TYPES.find(bt => bt.type === selectedBlock.type)?.label}</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <BlockEditor block={selectedBlock} onSave={(content, settings) => handleUpdateBlock(selectedBlock.id, { content, settings })} saving={saving} />
            </ScrollArea>
          </aside>
        ) : selectedPage ? (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-gray-800">Page Settings</h3>
              <p className="text-xs text-gray-400 mt-0.5">/{selectedPage.slug}</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Title (English)</Label>
                  <Input defaultValue={selectedPage.titleEn} onBlur={e => handleUpdatePage({ titleEn: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Title (Hindi)</Label>
                  <Input defaultValue={selectedPage.titleHi} onBlur={e => handleUpdatePage({ titleHi: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Title (Malayalam)</Label>
                  <Input defaultValue={selectedPage.titleMl} onBlur={e => handleUpdatePage({ titleMl: e.target.value })} />
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">URL Slug</Label>
                  <Input defaultValue={selectedPage.slug} onBlur={e => handleUpdatePage({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Template</Label>
                  <Select defaultValue={selectedPage.template} onValueChange={v => handleUpdatePage({ template: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500">Theme</Label>
                  <Select defaultValue={selectedPage.theme} onValueChange={v => handleUpdatePage({ theme: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {THEMES.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors[0] }} />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Published</Label>
                  <Switch checked={selectedPage.published} onCheckedChange={v => handleUpdatePage({ published: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500">Home Page</Label>
                  <Switch checked={selectedPage.isHomePage} onCheckedChange={v => handleUpdatePage({ isHomePage: v })} />
                </div>
                <Separator />
                <a href={`/p/${selectedPage.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="size-3.5" /> Preview Page
                  </Button>
                </a>
              </div>
            </ScrollArea>
          </aside>
        ) : null}
      </div>

      {/* New Page Dialog */}
      <Dialog open={showNewPage} onOpenChange={setShowNewPage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>Add a new page to your website.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., National Leadership" />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">/p/</span>
                <Input value={newSlug} onChange={e => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="national-leadership" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={newTemplate} onValueChange={setNewTemplate}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={newTheme} onValueChange={setNewTheme}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {THEMES.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors[0] }} />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPage(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCreatePage} disabled={!newSlug || !newTitle || saving}>
              {saving ? <Loader2 className="size-4 animate-spin mr-1" /> : <Plus className="size-4 mr-1" />}
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Block Dialog */}
      <Dialog open={showAddBlock} onOpenChange={setShowAddBlock}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
            <DialogDescription>Choose a block type to add to your page.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
            {BLOCK_TYPES.map(bt => (
              <button
                key={bt.type}
                onClick={() => handleAddBlock(bt.type)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all text-center group"
              >
                <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                  {bt.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{bt.label}</span>
                <span className="text-[10px] text-gray-400">{bt.description}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Block Editor Component ──────────────────────────────────────────────────

function BlockEditor({ block, onSave, saving }: { block: BlockData; onSave: (content: object, settings: object) => void; saving: boolean }) {
  const [content, setContent] = useState<Record<string, string>>(() => {
    try { return JSON.parse(block.content) } catch { return {} }
  })
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    try { return JSON.parse(block.settings) } catch { return {} }
  })
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    try { setContent(JSON.parse(block.content)) } catch { setContent({}) }
    try { setSettings(JSON.parse(block.settings)) } catch { setSettings({}) }
    setDirty(false)
  }, [block.id, block.content, block.settings])

  const updateContent = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
    setDirty(true)
  }
  const updateSettings = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const isImageKey = (key: string) => /image|photo|banner|avatar|logo|thumbnail|src/i.test(key)

  // Render fields based on block type
  const renderFields = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Field label="Title (EN)" value={content.titleEn || ''} onChange={v => updateContent('titleEn', v)} />
            <Field label="Title (HI)" value={content.titleHi || ''} onChange={v => updateContent('titleHi', v)} />
            <Field label="Title (ML)" value={content.titleMl || ''} onChange={v => updateContent('titleMl', v)} />
            <Field label="Subtitle (EN)" value={content.subtitleEn || ''} onChange={v => updateContent('subtitleEn', v)} multiline />
            <Field label="CTA Text" value={content.ctaText || ''} onChange={v => updateContent('ctaText', v)} />
            <Field label="CTA Link" value={content.ctaLink || ''} onChange={v => updateContent('ctaLink', v)} />
            <div className="space-y-1.5">
              <Label className="text-xs">Background Image</Label>
              <ImageUploader value={content.bgImage || ''} onChange={v => updateContent('bgImage', v)} folder="pages" placeholder="Upload hero image" aspectRatio="aspect-video" />
            </div>
          </div>
        )
      case 'text':
        return (
          <div className="space-y-4">
            <Field label="Heading (EN)" value={content.headingEn || ''} onChange={v => updateContent('headingEn', v)} />
            <Field label="Heading (HI)" value={content.headingHi || ''} onChange={v => updateContent('headingHi', v)} />
            <Field label="Heading (ML)" value={content.headingMl || ''} onChange={v => updateContent('headingMl', v)} />
            <Field label="Body (EN)" value={content.bodyEn || ''} onChange={v => updateContent('bodyEn', v)} multiline />
            <Field label="Body (HI)" value={content.bodyHi || ''} onChange={v => updateContent('bodyHi', v)} multiline />
            <Field label="Body (ML)" value={content.bodyMl || ''} onChange={v => updateContent('bodyMl', v)} multiline />
          </div>
        )
      case 'leaders':
        return (
          <div className="space-y-4">
            <Field label="Section Title (EN)" value={content.titleEn || ''} onChange={v => updateContent('titleEn', v)} />
            <Field label="Section Title (HI)" value={content.titleHi || ''} onChange={v => updateContent('titleHi', v)} />
            <Field label="Member Category" value={content.category || 'ham'} onChange={v => updateContent('category', v)} />
            <p className="text-xs text-gray-400">Shows members from the Members panel matching this category (ham, yham, endorsement)</p>
            <Field label="Columns" value={settings.columns || '4'} onChange={v => updateSettings('columns', v)} />
          </div>
        )
      case 'gallery':
        return (
          <div className="space-y-4">
            <Field label="Title" value={content.title || ''} onChange={v => updateContent('title', v)} />
            <p className="text-xs text-gray-400">Images are pulled from the Media library. Set category filter below.</p>
            <Field label="Media Category" value={content.mediaCategory || 'general'} onChange={v => updateContent('mediaCategory', v)} />
            <Field label="Columns" value={settings.columns || '3'} onChange={v => updateSettings('columns', v)} />
          </div>
        )
      case 'video':
        return (
          <div className="space-y-4">
            <Field label="YouTube URL" value={content.youtubeUrl || ''} onChange={v => updateContent('youtubeUrl', v)} />
            <Field label="Caption" value={content.caption || ''} onChange={v => updateContent('caption', v)} />
          </div>
        )
      case 'cta':
        return (
          <div className="space-y-4">
            <Field label="Heading (EN)" value={content.headingEn || ''} onChange={v => updateContent('headingEn', v)} />
            <Field label="Heading (HI)" value={content.headingHi || ''} onChange={v => updateContent('headingHi', v)} />
            <Field label="Button Text" value={content.buttonText || ''} onChange={v => updateContent('buttonText', v)} />
            <Field label="Button Link" value={content.buttonLink || ''} onChange={v => updateContent('buttonLink', v)} />
            <Field label="Phone" value={content.phone || ''} onChange={v => updateContent('phone', v)} />
            <Field label="Email" value={content.email || ''} onChange={v => updateContent('email', v)} />
          </div>
        )
      case 'stats':
        return (
          <div className="space-y-4">
            <Field label="Stat 1 Label" value={content.stat1Label || ''} onChange={v => updateContent('stat1Label', v)} />
            <Field label="Stat 1 Value" value={content.stat1Value || ''} onChange={v => updateContent('stat1Value', v)} />
            <Field label="Stat 2 Label" value={content.stat2Label || ''} onChange={v => updateContent('stat2Label', v)} />
            <Field label="Stat 2 Value" value={content.stat2Value || ''} onChange={v => updateContent('stat2Value', v)} />
            <Field label="Stat 3 Label" value={content.stat3Label || ''} onChange={v => updateContent('stat3Label', v)} />
            <Field label="Stat 3 Value" value={content.stat3Value || ''} onChange={v => updateContent('stat3Value', v)} />
          </div>
        )
      case 'spacer':
        return (
          <div className="space-y-4">
            <Field label="Height (px)" value={settings.height || '48'} onChange={v => updateSettings('height', v)} />
          </div>
        )
      case 'contact':
        return (
          <div className="space-y-4">
            <Field label="Form Title" value={content.title || ''} onChange={v => updateContent('title', v)} />
            <Field label="Submit Button Text" value={content.submitText || 'Send Message'} onChange={v => updateContent('submitText', v)} />
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            {Object.entries(content).map(([key, val]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs uppercase text-gray-500">{key}</Label>
                {isImageKey(key) ? (
                  <ImageUploader value={val} onChange={v => updateContent(key, v)} folder="pages" />
                ) : (
                  <Textarea value={val} onChange={e => updateContent(key, e.target.value)} rows={2} className="text-sm" />
                )}
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => { const key = prompt('Field name:'); if (key) updateContent(key, '') }}>
              <Plus className="size-3 mr-1" /> Add Field
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          {renderFields()}
        </TabsContent>
        <TabsContent value="style" className="mt-4 space-y-4">
          <Field label="Background Color" value={settings.bgColor || ''} onChange={v => updateSettings('bgColor', v)} />
          <Field label="Text Color" value={settings.textColor || ''} onChange={v => updateSettings('textColor', v)} />
          <Field label="Padding" value={settings.padding || 'py-16'} onChange={v => updateSettings('padding', v)} />
          <Field label="Max Width" value={settings.maxWidth || 'max-w-7xl'} onChange={v => updateSettings('maxWidth', v)} />
        </TabsContent>
      </Tabs>

      <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => onSave(content, settings)} disabled={!dirty || saving}>
        {saving ? <Loader2 className="size-4 animate-spin mr-1" /> : <Save className="size-4 mr-1" />}
        {saving ? 'Saving...' : 'Save Block'}
      </Button>
    </div>
  )
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-500">{label}</Label>
      {multiline ? (
        <Textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="text-sm" />
      ) : (
        <Input value={value} onChange={e => onChange(e.target.value)} className="text-sm" />
      )}
    </div>
  )
}
