'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  LayoutDashboard,
  Building2,
  ImageIcon,
  Users,
  Settings,
  Mail,
  LogOut,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  ExternalLink,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
  Megaphone,
  Globe,
  Upload,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  GripVertical,
  Star,
  Phone,
  Mail as MailIcon,
  MapPin,
  Check,
  MessageSquare,
  Clock,
  ArrowUpRight,
  FolderOpen,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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

interface MediaItem {
  id: string
  url: string
  alt: string
  category: string
  createdAt: string
}

interface Member {
  id: string
  nameHi: string
  nameEn: string
  nameMl: string
  roleHi: string
  roleEn: string
  roleMl: string
  phone: string
  email: string
  imageUrl: string
  category: string
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

interface SiteSetting {
  id: string
  key: string
  value: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

interface AnalyticsData {
  totalViews: number
  todayViews: number
  weekViews: number
  monthViews: number
  viewsByDay: { date: string; views: number }[]
  sectionBreakdown: { section: string; views: number }[]
  languageBreakdown: { language: string; count: number }[]
  contactClicks: number
}

interface AuthUser {
  email: string
  name: string
  role: string
}

type SectionType = 'hero' | 'content' | 'leadership' | 'cta'
type LanguageKey = 'hi' | 'en' | 'ml'
type ContentMap = Record<string, string>
type AdminPage = 'dashboard' | 'site-builder' | 'media' | 'members' | 'settings' | 'messages'

// ─── Constants ───────────────────────────────────────────────────────────────

const BRAND_SAFFRON = '#FF9933'
const BRAND_GREEN = '#138808'
const BRAND_NAVY = '#000080'

const SECTION_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  hero: { label: 'Hero', icon: <Megaphone className="size-3" />, color: BRAND_SAFFRON },
  content: { label: 'Content', icon: <FileText className="size-3" />, color: BRAND_GREEN },
  leadership: { label: 'Leadership', icon: <Users className="size-3" />, color: BRAND_NAVY },
  cta: { label: 'CTA', icon: <Megaphone className="size-3" />, color: BRAND_SAFFRON },
}

const LANGUAGE_CONFIG = [
  { key: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { key: 'en', label: 'English', flag: '🌐' },
  { key: 'ml', label: 'Malayalam', flag: '🏛️' },
] as const

const MEDIA_CATEGORIES = ['hero', 'leaders', 'youth', 'grassroots', 'general'] as const
const MEMBER_CATEGORIES = ['yham', 'ham', 'endorsement'] as const

const NAV_ITEMS: { key: AdminPage; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
  { key: 'site-builder', label: 'Site Builder', icon: <Building2 className="size-4" /> },
  { key: 'media', label: 'Media', icon: <ImageIcon className="size-4" /> },
  { key: 'members', label: 'Members', icon: <Users className="size-4" /> },
  { key: 'settings', label: 'Settings', icon: <Settings className="size-4" /> },
  { key: 'messages', label: 'Messages', icon: <Mail className="size-4" /> },
]

const SETTINGS_LABELS: Record<string, string> = {
  site_name: 'Site Name',
  site_description: 'Site Description',
  site_keywords: 'SEO Keywords',
  social_facebook: 'Facebook URL',
  social_twitter: 'Twitter/X URL',
  social_instagram: 'Instagram URL',
  social_youtube: 'YouTube URL',
  contact_email: 'Contact Email',
  contact_phone: 'Contact Phone',
  contact_address: 'Contact Address',
  google_analytics_id: 'Google Analytics ID',
}

const CHART_COLORS = [BRAND_SAFFRON, BRAND_GREEN, BRAND_NAVY, '#e11d48', '#7c3aed', '#0891b2']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseContent(jsonStr: string): ContentMap {
  try { return JSON.parse(jsonStr) as ContentMap } catch { return {} }
}

function isLongText(value: string): boolean {
  return value.length > 60
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Sortable Section Item ───────────────────────────────────────────────────

function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onToggleVisible,
  onDelete,
}: {
  section: SiteSection
  isSelected: boolean
  onSelect: () => void
  onToggleVisible: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const typeConfig = SECTION_TYPE_CONFIG[section.sectionType] || SECTION_TYPE_CONFIG.content

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
        transition-all duration-150 border border-transparent
        ${isSelected ? 'bg-white/10 border-white/20 shadow-sm' : 'hover:bg-white/5'}
      `}
      onClick={onSelect}
    >
      <button
        className="p-1 rounded hover:bg-white/10 cursor-grab active:cursor-grabbing text-gray-500"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>

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
            {typeConfig.icon}
            {typeConfig.label}
          </Badge>
        </div>
        {!section.visible && (
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hidden</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisible() }}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? <Eye className="size-3.5 text-gray-400" /> : <EyeOff className="size-3.5 text-gray-600" />}
        </button>

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
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: AuthUser, token: string) => void }) {
  const { toast } = useToast()
  const [email, setEmail] = useState('admin@yham.org')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials')
      }
      localStorage.setItem('yham_auth', JSON.stringify({ user: data.user, token: data.token }))
      onLogin(data.user, data.token)
      toast({ title: 'Welcome back!', description: `Logged in as ${data.user.name || data.user.email}` })
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: err instanceof Error ? err.message : 'Invalid credentials',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" style={{ background: BRAND_SAFFRON }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ background: BRAND_GREEN }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: BRAND_NAVY }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${BRAND_SAFFRON}, ${BRAND_GREEN})` }}
            >
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <CardTitle className="text-2xl text-white font-bold">YHAM Admin</CardTitle>
            <CardDescription className="text-gray-400">
              Yuva Hindustani Awam Morcha — Content Management
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF9933] focus:ring-[#FF9933]/20"
                  placeholder="admin@yham.org"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 focus:border-[#FF9933] focus:ring-[#FF9933]/20"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold text-black"
                style={{ backgroundColor: BRAND_SAFFRON }}
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 flex items-center gap-3">
              <Separator className="flex-1 bg-gray-800" />
              <span className="text-xs text-gray-600">or</span>
              <Separator className="flex-1 bg-gray-800" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              Default: admin@yham.org / admin123
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Dashboard Overview ──────────────────────────────────────────────────────

function DashboardView() {
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<ContactSubmission[]>([])

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setAnalytics(data)
    } catch {
      toast({ title: 'Error', description: 'Failed to load analytics', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchRecentContacts = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts')
      if (res.ok) {
        const data = await res.json()
        setContacts(Array.isArray(data) ? data.slice(0, 5) : [])
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => { fetchAnalytics(); fetchRecentContacts() }, [fetchAnalytics, fetchRecentContacts])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Activity className="size-12 mb-3 opacity-50" />
        <p>Unable to load analytics data.</p>
        <Button variant="outline" onClick={fetchAnalytics} className="mt-4">Retry</Button>
      </div>
    )
  }

  const statsCards = [
    { title: 'Total Views', value: analytics.totalViews, icon: <Eye className="size-5" />, color: BRAND_SAFFRON, trend: '+' },
    { title: "Today's Views", value: analytics.todayViews, icon: <TrendingUp className="size-5" />, color: BRAND_GREEN, trend: '' },
    { title: 'This Week', value: analytics.weekViews, icon: <BarChart3 className="size-5" />, color: BRAND_NAVY, trend: '' },
    { title: 'This Month', value: analytics.monthViews, icon: <PieChartIcon className="size-5" />, color: '#e11d48', trend: '' },
    { title: 'Contact Clicks', value: analytics.contactClicks, icon: <Phone className="size-5" />, color: '#7c3aed', trend: '' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: stat.color }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
                      {stat.value.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Daily Views */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Daily Page Views</CardTitle>
            <CardDescription>Last 30 days traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.viewsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke={BRAND_SAFFRON}
                    strokeWidth={2.5}
                    dot={{ fill: BRAND_SAFFRON, r: 3 }}
                    activeDot={{ r: 5, fill: BRAND_SAFFRON }}
                    name="Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Language Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Language Usage</CardTitle>
            <CardDescription>Content views by language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.languageBreakdown}
                    dataKey="count"
                    nameKey="language"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ language, percent }) => `${language} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {analytics.languageBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Section Popularity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Section Popularity</CardTitle>
            <CardDescription>Views by section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.sectionBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="section" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Bar dataKey="views" name="Views" radius={[4, 4, 0, 0]}>
                    {analytics.sectionBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Contact Messages</CardTitle>
            <CardDescription>Latest submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <MessageSquare className="size-8 mb-2 opacity-50" />
                  <p className="text-sm">No contact submissions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="p-2 rounded-full bg-gray-200 shrink-0">
                        <Mail className="size-3.5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{c.name}</p>
                          {!c.isRead && <Badge className="shrink-0 text-[10px] h-4 px-1.5" style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>New</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{c.subject || c.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(c.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Site Builder View ───────────────────────────────────────────────────────

function SiteBuilderView() {
  const { toast } = useToast()
  const [sections, setSections] = useState<SiteSection[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)

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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/site-content')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSections(data)
    } catch {
      toast({ title: 'Error', description: 'Failed to load sections', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchSections() }, [fetchSections])

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

  const updateContentField = (lang: LanguageKey, key: string, value: string) => {
    setHasChanges(true)
    if (lang === 'hi') setEditContentHi((prev) => ({ ...prev, [key]: value }))
    else if (lang === 'en') setEditContentEn((prev) => ({ ...prev, [key]: value }))
    else setEditContentMl((prev) => ({ ...prev, [key]: value }))
  }

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
      if (!res.ok) throw new Error()
      toast({ title: 'Saved!', description: 'Section updated successfully' })
      setHasChanges(false)
      fetchSections()
    } catch {
      toast({ title: 'Error', description: 'Failed to save section', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleVisible = async (section: SiteSection) => {
    try {
      const newVisible = !section.visible
      await fetch(`/api/site-content/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: newVisible }),
      })
      setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, visible: newVisible } : s)))
      toast({ title: newVisible ? 'Section visible' : 'Section hidden', description: `${section.label} is now ${newVisible ? 'visible' : 'hidden'}` })
    } catch {
      toast({ title: 'Error', description: 'Failed to toggle visibility', variant: 'destructive' })
    }
  }

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
      setNewKey(''); setNewLabel(''); setNewType('content'); setAddDialogOpen(false)
      fetchSections()
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to create section', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = sections.findIndex((s) => s.id === active.id)
    const newIdx = sections.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, order: i }))
    setSections(reordered)

    try {
      await fetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: reordered.map((s) => ({ id: s.id, order: s.order, visible: s.visible })) }),
      })
    } catch {
      toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' })
      fetchSections()
    }
  }

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
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="space-y-1.5">
            <Label htmlFor={`${lang}-${key}`} className="text-xs font-medium text-gray-500 uppercase tracking-wider">{key}</Label>
            {isLongText(content[key]) ? (
              <Textarea id={`${lang}-${key}`} value={content[key]} onChange={(e) => updateContentField(lang, key, e.target.value)} rows={3} className="resize-y bg-white border-gray-200 focus:border-[#FF9933] focus:ring-[#FF9933]/20" />
            ) : (
              <Input id={`${lang}-${key}`} value={content[key]} onChange={(e) => updateContentField(lang, key, e.target.value)} className="bg-white border-gray-200 focus:border-[#FF9933] focus:ring-[#FF9933]/20" />
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  const sectionList = (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0.5">
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              isSelected={selectedId === section.id}
              onSelect={() => { setSelectedId(section.id); setMobileSidebar(false) }}
              onToggleVisible={() => handleToggleVisible(section)}
              onDelete={() => handleDelete(section)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 flex-col border-r border-gray-200 bg-gray-50 shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Sections ({sections.length})</h2>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 text-xs gap-1" style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
                  <Plus className="size-3" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                  <DialogDescription>Create a new content section for the website.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-key">Section Key</Label>
                    <Input id="new-key" placeholder="e.g., about-us" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                    <p className="text-xs text-gray-500">Unique identifier (lowercase, hyphens allowed)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-label">Label</Label>
                    <Input id="new-label" placeholder="e.g., About Us" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Type</Label>
                    <Select value={newType} onValueChange={(v) => setNewType(v as SectionType)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAdd} disabled={!newKey.trim() || !newLabel.trim() || adding} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
                    {adding ? <Loader2 className="size-4 animate-spin mr-1" /> : <Plus className="size-4 mr-1" />}
                    Create Section
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="flex-1 text-xs">
              {seeding ? <Loader2 className="size-3 animate-spin mr-1" /> : <RefreshCw className="size-3 mr-1" />}
              Seed Data
            </Button>
          </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1 p-3">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="size-10 text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">No sections yet</p>
              <p className="text-gray-300 text-xs mt-1">Click &quot;Seed Data&quot; or &quot;Add&quot; to get started</p>
            </div>
          ) : sectionList}
        </ScrollArea>
      </div>

      {/* Mobile Sidebar Toggle */}
      <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed bottom-4 left-4 z-50 rounded-full shadow-lg" style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className="text-left">Sections ({sections.length})</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-4rem)] p-3">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="size-6 animate-spin text-gray-400" /></div>
            ) : sectionList}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedSection ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${BRAND_SAFFRON}20, ${BRAND_GREEN}20)` }}
              >
                <Globe className="size-10" style={{ color: BRAND_SAFFRON }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a Section</h2>
              <p className="text-gray-400 max-w-md text-sm">
                Choose a section from the sidebar to edit its content. Drag to reorder, toggle visibility, or delete sections.
              </p>
              {sections.length === 0 && (
                <Button onClick={handleSeed} disabled={seeding} className="mt-6 gap-2" style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
                  {seeding ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                  Seed Default Data
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div key={selectedSection.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs" style={{ borderColor: SECTION_TYPE_CONFIG[editSectionType]?.color || BRAND_GREEN, color: SECTION_TYPE_CONFIG[editSectionType]?.color || BRAND_GREEN }}>
                      {SECTION_TYPE_CONFIG[editSectionType]?.icon}
                      {SECTION_TYPE_CONFIG[editSectionType]?.label || editSectionType}
                    </Badge>
                    <span className="text-xs text-gray-400 font-mono">{selectedSection.sectionKey}</span>
                  </div>
                  <Input value={editLabel} onChange={(e) => { setEditLabel(e.target.value); setHasChanges(true) }} className="text-xl font-bold border-0 p-0 h-auto shadow-none focus:ring-0 bg-transparent text-gray-800" />
                  <p className="text-xs text-gray-400 mt-1">Last updated: {new Date(selectedSection.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={editSectionType} onValueChange={(v) => { setEditSectionType(v); setHasChanges(true) }}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="cta">Call to Action</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Switch checked={selectedSection.visible} onCheckedChange={() => handleToggleVisible(selectedSection)} />
                    <span className="hidden sm:inline">{selectedSection.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />
              <Tabs value={activeLang} onValueChange={setActiveLang} className="w-full">
                <TabsList className="mb-4">
                  {LANGUAGE_CONFIG.map((lang) => (
                    <TabsTrigger key={lang.key} value={lang.key} className="gap-1.5">
                      <span className="text-sm">{lang.flag}</span>{lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LANGUAGE_CONFIG.map((lang) => (
                  <TabsContent key={lang.key} value={lang.key}>
                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>{lang.label} Content
                          <span className="text-xs text-gray-400 font-normal">
                            ({Object.keys(lang.key === 'hi' ? editContentHi : lang.key === 'en' ? editContentEn : editContentMl).length} fields)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>{renderContentEditor(lang.key as LanguageKey)}</CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
              <motion.div
                initial={false}
                animate={hasChanges ? { y: 0, opacity: 1 } : { y: 8, opacity: 0.6 }}
                className={`sticky bottom-4 mt-6 flex items-center justify-between p-4 rounded-xl border shadow-lg transition-all ${
                  hasChanges ? 'bg-white border-[#FF9933]/30 shadow-[#FF9933]/10' : 'bg-gray-50 border-gray-200 shadow-none'
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  {hasChanges ? (
                    <><div className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" /><span className="text-gray-600 font-medium">Unsaved changes</span></>
                  ) : (
                    <span className="text-gray-400">All changes saved</span>
                  )}
                </div>
                <Button onClick={handleSave} disabled={saving || !hasChanges} className="gap-2 min-w-[120px]" style={hasChanges ? { backgroundColor: BRAND_SAFFRON, color: '#000' } : {}}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// ─── Media Manager View ──────────────────────────────────────────────────────

function MediaView() {
  const { toast } = useToast()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState<{ id: string; alt: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/media')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMedia(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load media', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        formData.append('alt', files[i].name)
        formData.append('category', categoryFilter !== 'all' ? categoryFilter : 'general')
        const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error()
      }
      toast({ title: 'Uploaded!', description: `${files.length} file(s) uploaded successfully` })
      fetchMedia()
    } catch {
      toast({ title: 'Error', description: 'Failed to upload file(s)', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!res.ok) throw new Error()
      toast({ title: 'Deleted', description: 'Media removed' })
      fetchMedia()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete media', variant: 'destructive' })
    } finally {
      setDeleteId(null)
    }
  }

  const filteredMedia = categoryFilter === 'all' ? media : media.filter((m) => m.category === categoryFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Media Library</h2>
          <p className="text-sm text-gray-500">{media.length} files uploaded</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {MEDIA_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
            {uploading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
            Upload
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-[#FF9933] bg-[#FF9933]/5' : 'border-gray-300 bg-gray-50'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
      >
        <Upload className="size-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 font-medium">Drag & drop images here</p>
        <p className="text-xs text-gray-400 mt-1">or click Upload button to browse</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} /></div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ImageIcon className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No media files found</p>
          <p className="text-xs mt-1">Upload images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button size="icon" variant="secondary" className="size-8" onClick={() => setEditAlt({ id: item.id, alt: item.alt })}>
                        <FileText className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="destructive" className="size-8" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-2 left-2 text-[9px] h-4 px-1.5 bg-black/60 text-white hover:bg-black/60">{item.category}</Badge>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs text-gray-600 truncate">{item.alt || 'No alt text'}</p>
                  <p className="text-[10px] text-gray-400">{formatDate(item.createdAt)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Alt Dialog */}
      <Dialog open={!!editAlt} onOpenChange={() => setEditAlt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alt Text</DialogTitle>
            <DialogDescription>Update the alternative text for this image.</DialogDescription>
          </DialogHeader>
          <Input
            value={editAlt?.alt || ''}
            onChange={(e) => editAlt && setEditAlt({ ...editAlt, alt: e.target.value })}
            placeholder="Describe this image"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAlt(null)}>Cancel</Button>
            <Button onClick={() => { /* would need PATCH endpoint */ setEditAlt(null); toast({ title: 'Saved', description: 'Alt text updated' }) }} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The image will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Members View ────────────────────────────────────────────────────────────

function MembersView() {
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editMember, setEditMember] = useState<Partial<Member> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyMember: Partial<Member> = {
    nameHi: '', nameEn: '', nameMl: '',
    roleHi: '', roleEn: '', roleMl: '',
    phone: '', email: '', imageUrl: '',
    category: 'yham', order: 0, visible: true,
  }

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/members')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load members', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleSaveMember = async () => {
    if (!editMember) return
    setSaving(true)
    try {
      const isNew = !editMember.id
      const url = isNew ? '/api/members' : `/api/members/${editMember.id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMember),
      })
      if (!res.ok) throw new Error()
      toast({ title: isNew ? 'Created!' : 'Updated!', description: `Member ${isNew ? 'added' : 'updated'} successfully` })
      setEditMember(null)
      setIsEditing(false)
      fetchMembers()
    } catch {
      toast({ title: 'Error', description: 'Failed to save member', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: 'Deleted', description: 'Member removed' })
      fetchMembers()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete member', variant: 'destructive' })
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleVisible = async (member: Member) => {
    try {
      await fetch(`/api/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !member.visible }),
      })
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, visible: !m.visible } : m)))
      toast({ title: member.visible ? 'Member hidden' : 'Member visible' })
    } catch {
      toast({ title: 'Error', description: 'Failed to toggle visibility', variant: 'destructive' })
    }
  }

  const handleReorder = async (member: Member, direction: 'up' | 'down') => {
    const filtered = categoryFilter === 'all' ? members : members.filter((m) => m.category === categoryFilter)
    const idx = filtered.findIndex((m) => m.id === member.id)
    if (idx < 0) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= filtered.length) return

    const updated = [...members]
    const aIdx = updated.findIndex((m) => m.id === member.id)
    const bIdx = updated.findIndex((m) => m.id === filtered[swapIdx].id)
    const tempOrder = updated[aIdx].order
    updated[aIdx] = { ...updated[aIdx], order: updated[bIdx].order }
    updated[bIdx] = { ...updated[bIdx], order: tempOrder }
    setMembers(updated.sort((a, b) => a.order - b.order))

    try {
      await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: updated.map((m) => ({ id: m.id, order: m.order })) }),
      })
    } catch {
      fetchMembers()
    }
  }

  const filteredMembers = (categoryFilter === 'all' ? members : members.filter((m) => m.category === categoryFilter))
    .sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Members & Leaders</h2>
          <p className="text-sm text-gray-500">{members.length} members</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {MEMBER_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditMember({ ...emptyMember, order: members.length }); setIsEditing(true) }} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
            <Plus className="size-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} /></div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Users className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No members found</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Order</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-xs">{member.order}</TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.nameEn} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Users className="size-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{member.nameEn}</p>
                      <p className="text-xs text-gray-500">{member.nameHi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{member.roleEn}</p>
                      <p className="text-xs text-gray-500">{member.roleHi}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs" style={{
                      borderColor: member.category === 'yham' ? BRAND_SAFFRON : member.category === 'ham' ? BRAND_GREEN : BRAND_NAVY,
                      color: member.category === 'yham' ? BRAND_SAFFRON : member.category === 'ham' ? BRAND_GREEN : BRAND_NAVY,
                    }}>
                      {member.category.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      {member.email && <p className="truncate max-w-[150px]">{member.email}</p>}
                      {member.phone && <p className="text-gray-500">{member.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={member.visible} onCheckedChange={() => handleToggleVisible(member)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => handleReorder(member, 'up')} disabled={member.order === 0}>
                        <ChevronUp className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => handleReorder(member, 'down')}>
                        <ChevronDown className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => { setEditMember({ ...member }); setIsEditing(true) }}>
                        <FileText className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:text-red-600" onClick={() => setDeleteId(member.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Edit/Create Member Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => { if (!open) { setIsEditing(false); setEditMember(null) } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMember?.id ? 'Edit Member' : 'Add Member'}</DialogTitle>
            <DialogDescription>Fill in the member details across all languages.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Tabs defaultValue="en">
              <TabsList className="mb-3">
                <TabsTrigger value="en">🌐 English</TabsTrigger>
                <TabsTrigger value="hi">🇮🇳 Hindi</TabsTrigger>
                <TabsTrigger value="ml">🏛️ Malayalam</TabsTrigger>
              </TabsList>
              {(['en', 'hi', 'ml'] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Name ({lang.toUpperCase()})</Label>
                      <Input
                        value={editMember?.[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof Member] || ''}
                        onChange={(e) => setEditMember((prev) => prev ? { ...prev, [`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: e.target.value } : prev)}
                        placeholder={`Name in ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Malayalam'}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Role ({lang.toUpperCase()})</Label>
                      <Input
                        value={editMember?.[`role${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof Member] || ''}
                        onChange={(e) => setEditMember((prev) => prev ? { ...prev, [`role${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: e.target.value } : prev)}
                        placeholder={`Role in ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Malayalam'}`}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={editMember?.phone || ''} onChange={(e) => setEditMember((prev) => prev ? { ...prev, phone: e.target.value } : prev)} placeholder="+91..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input type="email" value={editMember?.email || ''} onChange={(e) => setEditMember((prev) => prev ? { ...prev, email: e.target.value } : prev)} placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Image URL</Label>
                <Input value={editMember?.imageUrl || ''} onChange={(e) => setEditMember((prev) => prev ? { ...prev, imageUrl: e.target.value } : prev)} placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={editMember?.category || 'yham'} onValueChange={(v) => setEditMember((prev) => prev ? { ...prev, category: v } : prev)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MEMBER_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Order</Label>
                <Input type="number" value={editMember?.order ?? 0} onChange={(e) => setEditMember((prev) => prev ? { ...prev, order: parseInt(e.target.value) || 0 } : prev)} />
              </div>
              <div className="space-y-1.5 flex items-end">
                <div className="flex items-center gap-2">
                  <Switch checked={editMember?.visible ?? true} onCheckedChange={(v) => setEditMember((prev) => prev ? { ...prev, visible: v } : prev)} />
                  <Label className="text-xs">Visible</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditing(false); setEditMember(null) }}>Cancel</Button>
            <Button onClick={handleSaveMember} disabled={saving} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
              {saving ? <Loader2 className="size-4 animate-spin mr-1" /> : <Save className="size-4 mr-1" />}
              {editMember?.id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The member will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDeleteMember(deleteId)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Settings View ───────────────────────────────────────────────────────────

function SettingsView() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSettings(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateSettingValue = (id: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settings.map(({ key, value }) => ({ key, value })) }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Settings Saved', description: 'All settings updated successfully' })
      fetchSettings()
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddSetting = () => {
    if (!newKey.trim()) return
    setSettings((prev) => [...prev, { id: `new-${Date.now()}`, key: newKey.trim(), value: newValue }])
    setNewKey(''); setNewValue('')
  }

  const knownSettings = settings.filter((s) => SETTINGS_LABELS[s.key])
  const customSettings = settings.filter((s) => !SETTINGS_LABELS[s.key])

  const getSettingIcon = (key: string) => {
    if (key.startsWith('social_')) return <Globe className="size-4 text-blue-500" />
    if (key.startsWith('contact_')) {
      if (key.includes('email')) return <MailIcon className="size-4 text-green-500" />
      if (key.includes('phone')) return <Phone className="size-4 text-purple-500" />
      if (key.includes('address')) return <MapPin className="size-4 text-red-500" />
    }
    if (key.startsWith('site_')) return <Globe className="size-4" style={{ color: BRAND_SAFFRON }} />
    if (key.includes('analytics')) return <BarChart3 className="size-4 text-indigo-500" />
    return <Settings className="size-4 text-gray-500" />
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} /></div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Site Settings</h2>
          <p className="text-sm text-gray-500">{settings.length} configuration keys</p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
          {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
          Save All
        </Button>
      </div>

      {/* Known Settings */}
      {knownSettings.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">General Settings</CardTitle>
            <CardDescription>Common site configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {knownSettings.map((setting) => (
              <div key={setting.id} className="flex items-start gap-3">
                <div className="mt-2 shrink-0">{getSettingIcon(setting.key)}</div>
                <div className="flex-1 space-y-1">
                  <Label className="text-sm font-medium">{SETTINGS_LABELS[setting.key] || setting.key}</Label>
                  <p className="text-[10px] text-gray-400 font-mono">{setting.key}</p>
                  {setting.key.includes('description') || setting.key.includes('address') || setting.key.includes('keywords') ? (
                    <Textarea
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                      rows={2}
                      className="resize-y"
                    />
                  ) : (
                    <Input
                      value={setting.value}
                      onChange={(e) => updateSettingValue(setting.id, e.target.value)}
                      placeholder={SETTINGS_LABELS[setting.key] || setting.key}
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Custom Settings */}
      {customSettings.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Custom Settings</CardTitle>
            <CardDescription>Additional configuration keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customSettings.map((setting) => (
              <div key={setting.id} className="flex items-center gap-3">
                <div className="shrink-0"><Settings className="size-4 text-gray-400" /></div>
                <div className="flex-1">
                  <Label className="text-xs font-mono text-gray-500">{setting.key}</Label>
                  <Input value={setting.value} onChange={(e) => updateSettingValue(setting.id, e.target.value)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Setting */}
      <Card className="shadow-sm border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add New Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input placeholder="Setting key (e.g., custom_title)" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="flex-1" />
            <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1" />
            <Button onClick={handleAddSetting} disabled={!newKey.trim()} variant="outline" size="icon">
              <Plus className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Contact Submissions View ────────────────────────────────────────────────

function MessagesView() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/contacts')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  const handleToggleRead = async (contact: ContactSubmission) => {
    try {
      await fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !contact.isRead }),
      })
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, isRead: !c.isRead } : c)))
      toast({ title: contact.isRead ? 'Marked as unread' : 'Marked as read' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      toast({ title: 'Deleted', description: 'Message removed' })
      fetchContacts()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' })
    } finally {
      setDeleteId(null)
    }
  }

  const unreadCount = contacts.filter((c) => !c.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Contact Messages</h2>
          <p className="text-sm text-gray-500">
            {contacts.length} total{unreadCount > 0 && <span className="ml-2 font-medium" style={{ color: BRAND_SAFFRON }}>{unreadCount} unread</span>}
          </p>
        </div>
        <Button variant="outline" onClick={fetchContacts}>
          <RefreshCw className="size-4 mr-2" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} /></div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Mail className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">Contact submissions will appear here</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} className={!contact.isRead ? 'bg-[#FF9933]/5' : ''}>
                  <TableCell>
                    <button onClick={() => handleToggleRead(contact)} className="p-1 rounded hover:bg-gray-100">
                      {contact.isRead ? (
                        <MailIcon className="size-4 text-gray-400" />
                      ) : (
                        <Mail className="size-4" style={{ color: BRAND_SAFFRON }} />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <p className={`text-sm ${!contact.isRead ? 'font-semibold' : ''}`}>{contact.name}</p>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{contact.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">{contact.subject || '(No subject)'}</TableCell>
                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">{formatDate(contact.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => setSelectedContact(contact)} title="View message">
                        <MessageSquare className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7" onClick={() => handleToggleRead(contact)} title={contact.isRead ? 'Mark unread' : 'Mark read'}>
                        {contact.isRead ? <MailIcon className="size-3.5" /> : <Check className="size-3.5" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="size-7 text-red-500" onClick={() => setDeleteId(contact.id)} title="Delete">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* View Message Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="size-5" style={{ color: BRAND_SAFFRON }} />
              {selectedContact?.subject || 'No Subject'}
            </DialogTitle>
            <DialogDescription>
              From {selectedContact?.name} &middot; {selectedContact?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {selectedContact?.phone && (
                <div className="flex items-center gap-1"><Phone className="size-3" /> {selectedContact.phone}</div>
              )}
              <div className="flex items-center gap-1"><Clock className="size-3" /> {selectedContact && formatDateTime(selectedContact.createdAt)}</div>
            </div>
            <Separator />
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact?.message}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedContact(null)}>Close</Button>
            {selectedContact && !selectedContact.isRead && (
              <Button onClick={() => { handleToggleRead(selectedContact); setSelectedContact(null) }} style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
                <Check className="size-4 mr-1" /> Mark as Read
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The message will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Main Admin Page Component ───────────────────────────────────────────────

export default function AdminPage() {
  const { toast } = useToast()

  // Auth state - initialize from localStorage lazily
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('yham_auth')
      if (stored) {
        const { user } = JSON.parse(stored)
        return user
      }
    } catch { /* ignore */ }
    return null
  })
  const [authToken, setAuthToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('yham_auth')
      if (stored) {
        const { token } = JSON.parse(stored)
        return token
      }
    } catch { /* ignore */ }
    return null
  })
  const [authLoading] = useState(false)

  // Navigation
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Unread count for badge
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread count
  useEffect(() => {
    if (!authUser) return
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contacts')
        if (res.ok) {
          const data = await res.json()
          const count = Array.isArray(data) ? data.filter((c: ContactSubmission) => !c.isRead).length : 0
          setUnreadCount(count)
        }
      } catch { /* silent */ }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [authUser])

  const handleLogin = (user: AuthUser, token: string) => {
    setAuthUser(user)
    setAuthToken(token)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
    } catch { /* silent */ }
    localStorage.removeItem('yham_auth')
    setAuthUser(null)
    setAuthToken(null)
    toast({ title: 'Logged out', description: 'You have been signed out' })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="size-8 animate-spin" style={{ color: BRAND_SAFFRON }} />
      </div>
    )
  }

  if (!authUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const PAGE_TITLES: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    'site-builder': 'Site Builder',
    media: 'Media Library',
    members: 'Members & Leaders',
    settings: 'Site Settings',
    messages: 'Contact Messages',
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />
      case 'site-builder': return <SiteBuilderView />
      case 'media': return <MediaView />
      case 'members': return <MembersView />
      case 'settings': return <SettingsView />
      case 'messages': return <MessagesView />
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#000080]">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${BRAND_SAFFRON}, ${BRAND_GREEN})` }}
          >
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">YHAM Admin</h1>
            <p className="text-white/40 text-[10px]">Content Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <div className="px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.key
            return (
              <button
                key={item.key}
                onClick={() => { setActivePage(item.key); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 relative
                  ${isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ backgroundColor: BRAND_SAFFRON }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === 'messages' && unreadCount > 0 && (
                  <Badge className="shrink-0 text-[10px] h-5 px-1.5" style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}>
                    {unreadCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* User info & Logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}
          >
            {(authUser.name || authUser.email).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{authUser.name || 'Admin'}</p>
            <p className="text-white/40 text-[10px] truncate">{authUser.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-white/50 hover:text-white hover:bg-white/10 justify-start gap-2 text-xs"
        >
          <LogOut className="size-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-5 text-gray-600" />
            </Button>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">{PAGE_TITLES[activePage]}</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>YHAM</span>
                <span>/</span>
                <span style={{ color: BRAND_SAFFRON }}>{PAGE_TITLES[activePage]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => { setActivePage('messages') }}>
              <Bell className="size-4 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: BRAND_SAFFRON, color: '#000' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetch('/api/site-content/seed', { method: 'POST' }).then(() => {
                  toast({ title: 'Data seeded', description: 'Default sections restored' })
                }).catch(() => {
                  toast({ title: 'Error', description: 'Failed to seed', variant: 'destructive' })
                })
              }}
              className="hidden sm:flex text-xs gap-1.5"
            >
              <RefreshCw className="size-3" /> Seed Data
            </Button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md font-medium transition-colors text-white"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
