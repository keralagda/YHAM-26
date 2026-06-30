'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, ArrowLeft, Heart, Loader2, Award, QrCode, Clipboard, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'

const PRESETS = [100, 500, 1000, 5000, 10000]

export default function DonatePage() {
  const [lang, setLang] = useState<'en' | 'hi' | 'ml'>('en')
  const [amount, setAmount] = useState('500')
  const [customAmount, setCustomAmount] = useState('')
  const [mode, setMode] = useState('upi') // upi, qr, bank
  const [purpose, setPurpose] = useState('general')
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [completedDonation, setCompletedDonation] = useState<any>(null)

  const t = {
    en: {
      title: "❤️ Empower the Youth: Support YHAM",
      subtitle: "Your contributions directly fund grassroot mobilization, leadership programs, and social relief activities.",
      amountLabel: "Select Donation Amount (INR)",
      customLabel: "Custom Amount (₹)",
      purposeLabel: "Purpose of Donation",
      infoLabel: "Donor Details",
      name: "Full Name *",
      phone: "Phone Number *",
      email: "Email (Optional)",
      paymentMode: "Payment Method",
      upiBtn: "Pay via UPI App / QR",
      bankBtn: "Direct Bank Transfer",
      submitBtn: "Proceed to Support",
      successTitle: "Thank You for Your Support!",
      successText: "Your transaction has been recorded. Here is your official donation receipt details:",
      receiptTitle: "Donation Receipt",
      taxBenefit: "Tax exemption certificate details have been generated for your record.",
      resetBtn: "Support Again",
      backToHome: "Back to Home",
      copySuccess: "Details copied to clipboard!"
    },
    hi: {
      title: "❤️ युवाओं को सशक्त बनाएं: YHAM का समर्थन करें",
      subtitle: "आपका योगदान सीधे जमीनी स्तर पर लामबंदी, नेतृत्व कार्यक्रमों और सामाजिक राहत गतिविधियों को वित्तपोषित करता है।",
      amountLabel: "दान राशि चुनें (INR)",
      customLabel: "कस्टम राशि (₹)",
      purposeLabel: "दान का उद्देश्य",
      infoLabel: "दाता विवरण",
      name: "पूरा नाम *",
      phone: "फ़ोन नंबर *",
      email: "ईमेल (वैकल्पिक)",
      paymentMode: "भुगतान की विधि",
      upiBtn: "UPI ऐप / QR द्वारा भुगतान",
      bankBtn: "सीधा बैंक ट्रांसफर",
      submitBtn: "समर्थन के लिए आगे बढ़ें",
      successTitle: "आपके सहयोग के लिए धन्यवाद!",
      successText: "आपका लेनदेन दर्ज कर लिया गया है। यहां आपकी आधिकारिक दान रसीद का विवरण दिया गया है:",
      receiptTitle: "दान रसीद",
      taxBenefit: "आपके रिकॉर्ड के लिए कर छूट प्रमाणपत्र विवरण तैयार कर दिया गया है।",
      resetBtn: "फिर से समर्थन करें",
      backToHome: "मुख्य पृष्ठ पर वापस",
      copySuccess: "विवरण क्लिपबोर्ड पर कॉपी किया गया!"
    },
    ml: {
      title: "❤️ യുവാക്കളെ ശാക്തീകരിക്കുക: YHAM നെ പിന്തുണയ്ക്കുക",
      subtitle: "നിങ്ങളുടെ സംഭാവനകൾ താഴേത്തട്ടിലുള്ള പ്രവർത്തനങ്ങൾക്കും നേതൃത്വ പരിശീലനങ്ങൾക്കും ആശ്വാസ പ്രവർത്തനങ്ങൾക്കും വിനിയോഗിക്കുന്നു.",
      amountLabel: "സംഭാവന തുക തിരഞ്ഞെടുക്കുക (INR)",
      customLabel: "മറ്റ് തുകകൾ (₹)",
      purposeLabel: "സംഭാവനയുടെ ലക്ഷ്യം",
      infoLabel: "ദാതാവിൻ്റെ വിവരങ്ങൾ",
      name: "പൂർണ്ണമായ പേര് *",
      phone: "ഫോൺ നമ്പർ *",
      email: "ഇമെയിൽ (നിർബന്ധമില്ലാത്തത്)",
      paymentMode: "പേയ്‌മെന്റ് രീതി",
      upiBtn: "UPI ആപ്പ് / QR വഴി അടയ്ക്കുക",
      bankBtn: "ബാങ്ക് ട്രാൻസ്ഫർ",
      submitBtn: "സംഭാവന നൽകുക",
      successTitle: "നിങ്ങളുടെ പിന്തുണയ്ക്ക് നന്ദി!",
      successText: "നിങ്ങളുടെ സംഭാവന വിജയകരമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്. നിങ്ങളുടെ രസീത് താഴെ നൽകുന്നു:",
      receiptTitle: "സംഭാവന രസീത്",
      taxBenefit: "നികുതിയിളവ് സർട്ടിഫിക്കറ്റ് സംബന്ധിച്ച വിവരങ്ങൾ ലഭ്യമാക്കിയിട്ടുണ്ട്.",
      resetBtn: "വീണ്ടും സംഭാവന ചെയ്യുക",
      backToHome: "പ്രധാന പേജിലേക്ക് മടങ്ങുക",
      copySuccess: "വിവരങ്ങൾ പകർത്തിയിട്ടുണ്ട്!"
    }
  }[lang]

  const handleCopyBank = () => {
    navigator.clipboard.writeText('Bank: State Bank of India\nA/C No: 40998877665\nIFSC: SBIN0001020\nBranch: New Delhi Main')
    alert(t.copySuccess)
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount)
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid amount.')
      return
    }
    if (!donorName || !donorPhone) {
      alert('Please fill in Name and Phone Number.')
      return
    }

    setLoading(true)
    try {
      const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          donorPhone,
          donorEmail,
          amount: finalAmount,
          method: mode,
          purpose,
          transactionId,
          state: 'Delhi',
          notes: 'Public online portal contribution'
        })
      })

      if (res.ok) {
        const data = await res.json()
        setCompletedDonation(data)
      } else {
        alert('Transaction failed to record.')
      }
    } catch {
      alert('Network error. Transaction could not be finalized.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF9933]/10 via-white to-[#138808]/10 text-gray-800">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="size-6 text-red-600 fill-red-500 animate-pulse" />
            <span className="font-bold text-gray-900">YHAM Treasury</span>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          {completedDonation ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
              <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
                <div className="bg-green-600 text-white p-6 text-center space-y-2">
                  <CheckCircle className="size-12 mx-auto text-white" />
                  <h2 className="text-xl font-bold">{t.successTitle}</h2>
                  <p className="text-xs opacity-90">{t.successText}</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="border border-dashed border-gray-300 rounded-lg p-5 bg-gray-50 space-y-4">
                    <h3 className="text-center font-bold text-sm uppercase text-gray-400 tracking-wider">{t.receiptTitle}</h3>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <span className="text-gray-500">Donor Name:</span>
                      <span className="font-semibold text-right">{completedDonation.donorName}</span>
                      <span className="text-gray-500">Amount Paid:</span>
                      <span className="font-bold text-green-600 text-right">₹{completedDonation.amount.toLocaleString('en-IN')}</span>
                      <span className="text-gray-500">Purpose:</span>
                      <span className="font-semibold text-right capitalize">{completedDonation.purpose}</span>
                      <span className="text-gray-500">Transaction ID:</span>
                      <span className="font-mono text-xs text-right break-all">{completedDonation.transactionId}</span>
                      <span className="text-gray-500">Date:</span>
                      <span className="font-semibold text-right">{new Date(completedDonation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-xs text-blue-700 flex gap-2">
                    <Award className="size-4 shrink-0 mt-0.5" />
                    <p>{t.taxBenefit}</p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setCompletedDonation(null)}>{t.resetBtn}</Button>
                    <Link href="/" className="flex-1">
                      <Button style={{ backgroundColor: '#FF9933', color: '#000' }} className="w-full font-bold">{t.backToHome}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <form onSubmit={handleDonate} className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Form Inputs */}
                <div className="md:col-span-3 space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.amountLabel}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {PRESETS.map(p => (
                          <Button key={p} type="button" variant={amount === String(p) && !customAmount ? 'default' : 'outline'} className={amount === String(p) && !customAmount ? 'bg-[#FF9933] text-black font-semibold hover:bg-[#FF9933]/90' : ''} onClick={() => { setAmount(String(p)); setCustomAmount(''); }}>
                            ₹{p.toLocaleString('en-IN')}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="custom">{t.customLabel}</Label>
                        <Input id="custom" type="number" placeholder="Enter other amount" value={customAmount} onChange={e => { setCustomAmount(e.target.value); setAmount(''); }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.infoLabel}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="donorName">{t.name}</Label>
                        <Input id="donorName" required value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="e.g. Sunil Dev" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="donorPhone">{t.phone}</Label>
                          <Input id="donorPhone" required type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)} placeholder="e.g. +91-XXXXXXXXXX" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="donorEmail">{t.email}</Label>
                          <Input id="donorEmail" type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="e.g. sunil@example.com" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="purpose">{t.purposeLabel}</Label>
                        <Select value={purpose} onValueChange={setPurpose}>
                          <SelectTrigger id="purpose"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Party Operations</SelectItem>
                            <SelectItem value="campaign">Campaign & Outreach</SelectItem>
                            <SelectItem value="event">National Conventions & Events</SelectItem>
                            <SelectItem value="relief">Social Work & Disaster Relief</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Checkout Panel */}
                <div className="md:col-span-2 space-y-6">
                  <Card className="shadow-md sticky top-24 border-t-4 border-t-[#FF9933]">
                    <CardHeader>
                      <CardTitle className="text-lg">{t.paymentMode}</CardTitle>
                      <CardDescription>Select simulated transaction method</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <RadioGroup value={mode} onValueChange={setMode} className="space-y-3">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="upi" />
                          <QrCode className="size-5 text-[#FF9933]" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{t.upiBtn}</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value="bank_transfer" />
                          <CreditCard className="size-5 text-[#138808]" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{t.bankBtn}</p>
                          </div>
                        </label>
                      </RadioGroup>

                      {mode === 'upi' && (
                        <div className="p-4 bg-gray-50 border rounded-lg text-center space-y-3">
                          <p className="text-xs text-gray-500 font-semibold uppercase">Scan UPI QR Code to Pay</p>
                          <div className="size-32 bg-white border mx-auto flex items-center justify-center rounded-md p-2">
                            <svg className="size-full text-[#000080]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2z"/>
                            </svg>
                          </div>
                          <p className="text-[10px] text-gray-400">BHIM UPI QR code matches amount: ₹{customAmount || amount}</p>
                        </div>
                      )}

                      {mode === 'bank_transfer' && (
                        <div className="p-4 bg-gray-50 border rounded-lg text-xs space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bank Name:</span>
                            <span className="font-semibold">State Bank of India</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account No:</span>
                            <span className="font-semibold">40998877665</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">IFSC Code:</span>
                            <span className="font-semibold">SBIN0001020</span>
                          </div>
                          <Button type="button" size="sm" variant="outline" className="w-full gap-1.5" onClick={handleCopyBank}>
                            <Clipboard className="size-3.5" /> {t.copySuccess.split('!')[0]} Account Details
                          </Button>
                        </div>
                      )}

                      <Button type="submit" disabled={loading} style={{ backgroundColor: '#FF9933', color: '#000' }} className="w-full font-bold py-6 text-md">
                        {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Heart className="size-4 mr-2 text-red-600 fill-red-600" />}
                        {t.submitBtn}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
