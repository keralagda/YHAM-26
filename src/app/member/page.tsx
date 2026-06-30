'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ShieldCheck, MapPin, Award, Star, Loader2, LogOut, FileText, CheckSquare, TrendingUp, Download, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'

export default function MemberDashboardPage() {
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [secret, setSecret] = useState('')
  const [loginError, setLoginError] = useState('')

  // KPI logging modal
  const [showLogModal, setShowLogModal] = useState(false)
  const [kpiLoading, setKpiLoading] = useState(false)
  const [housesCount, setHousesCount] = useState('0')
  const [recruitsCount, setRecruitsCount] = useState('0')
  const [eventsCount, setEventsCount] = useState('0')

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  // Member tasks state
  const [memberTasks, setMemberTasks] = useState<any[]>([])
  const [memberTasksLoading, setMemberTasksLoading] = useState(false)

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/member/auth/session')
      if (res.ok) {
        const data = await res.json()
        setMember(data)
      } else {
        setMember(null)
      }
    } catch {
      setMember(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const res = await fetch('/api/member/leaderboard')
      if (res.ok) {
        setLeaderboard(await res.json())
      }
    } catch { /* */ }
    finally { setLeaderboardLoading(false) }
  }

  const fetchMemberTasks = async () => {
    setMemberTasksLoading(true)
    try {
      const res = await fetch('/api/member/tasks')
      if (res.ok) {
        setMemberTasks(await res.json())
      }
    } catch { /* */ }
    finally { setMemberTasksLoading(false) }
  }

  useEffect(() => {
    fetchSession()
    fetchLeaderboard()
    fetchMemberTasks()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !secret) return
    setAuthLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/member/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, secret })
      })

      if (res.ok) {
        const data = await res.json()
        setMember(data.member)
        fetchSession()
      } else {
        const err = await res.json()
        setLoginError(err.error || 'Login failed')
      }
    } catch {
      setLoginError('Network error. Failed to login.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/member/auth/logout', { method: 'POST' })
      setMember(null)
    } catch { /* */ }
  }

  const handleKpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setKpiLoading(true)
    try {
      const res = await fetch('/api/member/kpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houses: parseInt(housesCount) || 0,
          recruits: parseInt(recruitsCount) || 0,
          events: parseInt(eventsCount) || 0
        })
      })

      if (res.ok) {
        const data = await res.json()
        setMember(data)
        setShowLogModal(false)
        setHousesCount('0')
        setRecruitsCount('0')
        setEventsCount('0')
        fetchLeaderboard()
      } else {
        alert('Failed to log activity stats.')
      }
    } catch {
      alert('Error updating activity log.')
    } finally {
      setKpiLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/member/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      if (res.ok) {
        alert('Task completed! +20 KPI points awarded.')
        fetchSession()
        fetchMemberTasks()
        fetchLeaderboard()
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to complete task')
      }
    } catch {
      alert('Error recording task completion.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="size-10 animate-spin text-[#FF9933]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-gray-800">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-[#138808]" />
            <span className="font-bold text-gray-900">YHAM Cadre Workspace</span>
          </Link>
          {member && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:inline-block capitalize">{member.designation.replace('_', ' ')}</Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="size-4 mr-1.5" /> Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!member ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto py-12">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-xl border-t-4 border-t-[#FF9933]">
                <CardHeader className="text-center">
                  <div className="size-12 rounded-full bg-[#FF9933]/10 flex items-center justify-center mx-auto mb-2 text-[#FF9933]">
                    <User className="size-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Karyakarta Login</CardTitle>
                  <CardDescription>Enter your registered phone and credential secret (Aadhar Last 4 or Voter ID) to enter the portal.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Registered Phone Number</Label>
                      <Input id="phone" type="tel" required placeholder="e.g. +91..." value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="secret">Credential Secret (Aadhar Last 4 / Voter ID)</Label>
                      <Input id="secret" type="password" required placeholder="e.g. 5678 or ABC12345" value={secret} onChange={e => setSecret(e.target.value)} />
                    </div>
                    {loginError && (
                      <p className="text-xs text-red-500 font-semibold mt-1">{loginError}</p>
                    )}
                    <Button type="submit" disabled={authLoading} style={{ backgroundColor: '#FF9933', color: '#000' }} className="w-full font-bold">
                      {authLoading ? <Loader2 className="size-4 animate-spin mr-1" /> : null} Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          /* Cadre Dashboard Screen */
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jai Bhim! Welcome, {member.fullName}</h1>
                <p className="text-sm text-gray-500 mt-1">Configure your digital ID card, log your grassroots campaign work, and review team performance.</p>
              </div>
              <Button style={{ backgroundColor: '#FF9933', color: '#000' }} className="font-semibold" onClick={() => setShowLogModal(true)}>
                <CheckSquare className="size-4 mr-2" /> Log Activity Work
              </Button>
            </div>

            {/* Core KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-extrabold text-[#000080]">{member.kpiScore}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Total KPI Score</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-extrabold text-[#FF9933]">{member.housesVisited}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Houses Visited</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-extrabold text-[#138808]">{member.membersRecruited}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Members Recruited</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-extrabold text-purple-600">{member.eventsAttended}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Events Attended</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="id-card" className="w-full">
              <TabsList className="grid w-full grid-cols-5 max-w-xl">
                <TabsTrigger value="id-card">💳 Digital ID</TabsTrigger>
                <TabsTrigger value="tasks">📋 Tasks</TabsTrigger>
                <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
                <TabsTrigger value="guidelines">📜 Manuals</TabsTrigger>
                <TabsTrigger value="downloads">📁 Downloads</TabsTrigger>
              </TabsList>

              {/* ID Card Tab */}
              <TabsContent value="id-card" className="pt-4 flex flex-col items-center">
                <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 relative">
                  {/* Saffron / Green borders */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                  <div className="text-center border-b pb-4 mt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#000080] mb-3">
                      <span>YOUTH HAM REGISTRY</span>
                      <Badge className="bg-green-600 text-white text-[10px] capitalize">{member.status}</Badge>
                    </div>
                    <div className="size-24 rounded-full border-4 border-gray-100 bg-[#000080]/5 mx-auto overflow-hidden shadow-md flex items-center justify-center text-3xl font-bold text-[#000080] mb-2">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt="Avatar" className="size-full object-cover" />
                      ) : (
                        member.fullName.charAt(0)
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{member.fullName}</h2>
                    <p className="text-xs text-[#FF9933] font-bold uppercase mt-1">{member.designation.replace('_', ' ')}</p>
                  </div>
                  <div className="py-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID Number:</span>
                      <span className="font-mono font-bold text-gray-800">{member.id.slice(0, 12).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="font-bold text-gray-800">{member.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">State / Region:</span>
                      <span className="font-bold text-gray-800">{member.state || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">District:</span>
                      <span className="font-bold text-gray-800">{member.district || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold">SCAN TO VERIFY</p>
                      <p className="text-[9px] text-gray-300">YHAM Cadre Registry</p>
                    </div>
                    <div className="size-16 border rounded bg-white p-1">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`http://localhost:3000/member/verify/${member.id}`)}`} alt="Verification QR Code" className="size-full" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5"><FileText className="size-4" /> Print Digital ID</Button>
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="pt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign Tasks & Assignments</CardTitle>
                    <CardDescription>Review and complete campaign activities distributed by YHAM administrators.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {memberTasksLoading ? (
                      <div className="text-center py-8"><Loader2 className="size-6 animate-spin mx-auto text-[#FF9933]" /></div>
                    ) : memberTasks.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No tasks assigned to your designation at this time.</p>
                    ) : (
                      <div className="space-y-4">
                        {memberTasks.map(t => (
                          <div key={t.id} className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white hover:border-gray-300 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
                                {t.completed ? (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">Completed</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] text-[#FF9933] border-[#FF9933]/20 bg-[#FF9933]/5">Active</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{t.description}</p>
                            </div>
                            {!t.completed && (
                              <Button size="sm" style={{ backgroundColor: '#138808', color: '#fff' }} onClick={() => handleCompleteTask(t.id)}>
                                Mark Completed (+20 pts)
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="pt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Karyakarta Leaderboard</CardTitle>
                    <CardDescription>Top active cadre members ranked by verified grassroots campaign KPI score points.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {leaderboardLoading ? (
                      <div className="text-center py-8"><Loader2 className="size-6 animate-spin mx-auto text-[#FF9933]" /></div>
                    ) : leaderboard.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">No leaderboard data available.</p>
                    ) : (
                      <div className="divide-y">
                        {leaderboard.map((m, index) => (
                          <div key={m.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <span className={`size-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                index === 1 ? 'bg-gray-100 text-gray-600 border border-gray-300' :
                                index === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                'text-gray-400'
                              }`}>
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-sm">{m.fullName}</p>
                                <p className="text-xs text-gray-400 capitalize">{m.designation.replace('_', ' ')} • {m.state}</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#138808] text-sm flex items-center gap-1"><Star className="size-3.5 fill-[#138808]" /> {m.kpiScore} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Guidelines Tab */}
              <TabsContent value="guidelines" className="pt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Cadre Guidelines & Code of Conduct</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-sm leading-relaxed">
                    <p className="font-semibold text-gray-800">1. Grassroots House-to-House Visits:</p>
                    <p className="text-gray-600 ml-4">Engage with every household politely. Explain our national development and social upliftment policies. Distribute party flyers and note public issues to log under grievances.</p>
                    <p className="font-semibold text-gray-800">2. Recruitment Accountability:</p>
                    <p className="text-gray-600 ml-4">Ensure that new members recruited fill details correctly. Do not record duplicate profiles. Recruits must verify using Voter IDs or Aadhar cards.</p>
                    <p className="font-semibold text-gray-800">3. Integrity & Behavior:</p>
                    <p className="text-gray-600 ml-4">Keep strict transparency when dealing with citizens. Do not promise direct government results; instead, commit to escalating public issues via the Jan Sunwai portal.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Downloads Tab */}
              <TabsContent value="downloads" className="pt-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Downloads Center</CardTitle>
                    <CardDescription>Access official brochures, posters, manifestos, and training flyers.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="size-8 text-[#FF9933]" />
                          <div>
                            <p className="font-semibold text-sm">YHAM Manifesto 2026</p>
                            <p className="text-xs text-gray-400">PDF • 4.2 MB</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost"><Download className="size-4" /></Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="size-8 text-[#138808]" />
                          <div>
                            <p className="font-semibold text-sm">Volunteer Mobilization Guide</p>
                            <p className="text-xs text-gray-400">PDF • 1.8 MB</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost"><Download className="size-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* KPI Activity Logging Modal */}
      <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleKpiSubmit}>
            <DialogHeader>
              <DialogTitle>Log Grassroots Campaign Work</DialogTitle>
              <DialogDescription>Submit your latest outreach parameters. Submitted values will increment your active stats and automatically update your KPI performance metrics.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="houses">Houses Visited (Door-to-door)</Label>
                <Input id="houses" type="number" required value={housesCount} onChange={e => setHousesCount(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="recruits">New Members Recruited</Label>
                <Input id="recruits" type="number" required value={recruitsCount} onChange={e => setRecruitsCount(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="events">Meetings / Events Attended</Label>
                <Input id="events" type="number" required value={eventsCount} onChange={e => setEventsCount(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowLogModal(false)}>Cancel</Button>
              <Button type="submit" disabled={kpiLoading} style={{ backgroundColor: '#FF9933', color: '#000' }}>
                {kpiLoading ? <Loader2 className="size-4 animate-spin mr-1" /> : <TrendingUp className="size-4 mr-1" />} Report Activity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
