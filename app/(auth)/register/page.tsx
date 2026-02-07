'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { INSTITUTIONS } from '@/lib/institutions'
import {
  Zap,
  User,
  Building2,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  GraduationCap,
  Search,
  X,
  Mail,
  RefreshCw,
} from 'lucide-react'

// ─── Static Data ─────────────────────────────────────────
const COUNTRIES = [
  "India", "United States", "United Kingdom", "Germany", "France", "China",
  "Japan", "South Korea", "Canada", "Australia", "Singapore", "Malaysia",
  "Brazil", "Italy", "Spain", "Netherlands", "Switzerland", "Sweden",
  "Israel", "Taiwan", "Other",
]

const INDIA_STATES = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
  "Maharashtra", "Delhi", "Uttar Pradesh", "West Bengal", "Gujarat",
  "Rajasthan", "Madhya Pradesh", "Bihar", "Punjab", "Haryana",
  "Odisha", "Jharkhand", "Assam", "Goa", "Himachal Pradesh",
  "Uttarakhand", "Chhattisgarh", "Jammu and Kashmir", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura",
  "Arunachal Pradesh", "Puducherry", "Chandigarh", "Other",
]

const TAMIL_NADU_CITIES = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul",
  "Ranipet", "Sivakasi", "Karur", "Kanchipuram", "Tiruvannamalai",
  "Tiruppur", "Thoothukudi", "Nagercoil", "Cuddalore", "Kumbakonam",
  "Rajapalayam", "Pudukkottai", "Hosur", "Ambur", "Nagapattinam", "Other",
]

const ROLES = [
  "Undergraduate Student",
  "Master's Student",
  "PhD Scholar",
  "Postdoctoral Researcher",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Research Scientist",
  "Industry Researcher",
  "Lab Technician",
  "Independent Researcher",
  "Other",
]

const RESEARCH_AREAS = [
  "Batteries & Energy Storage",
  "Fuel Cells",
  "Supercapacitors",
  "Corrosion Science",
  "Electroplating & Surface Finishing",
  "Sensors & Biosensors",
  "Electrocatalysis",
  "Photoelectrochemistry",
  "Water Splitting",
  "CO₂ Reduction",
  "Organic Electrochemistry",
  "Electroanalytical Chemistry",
  "Nanomaterials",
  "Polymer Electrolytes",
  "Computational Electrochemistry",
  "Other",
]

// ─── Searchable Institution Combobox ─────────────────────
function InstitutionSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [query, setQuery] = useState(value === 'Other' ? '' : value)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = query.trim()
    ? INSTITUTIONS.filter((inst) =>
        inst.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 30)
    : INSTITUTIONS.slice(0, 30)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.children
      if (items[highlightIdx]) {
        (items[highlightIdx] as HTMLElement).scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightIdx])

  const handleSelect = useCallback(
    (inst: string) => {
      onChange(inst)
      setQuery(inst === 'Other' ? '' : inst)
      setIsOpen(false)
      setHighlightIdx(-1)
    },
    [onChange],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Always prevent Enter from bubbling up to the <form>
    if (e.key === 'Enter') e.preventDefault()

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true)
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIdx((p) => Math.min(p + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIdx((p) => Math.max(p - 1, 0))
        break
      case 'Enter':
        if (highlightIdx >= 0 && filtered[highlightIdx]) handleSelect(filtered[highlightIdx])
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightIdx(-1)
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
        <Building2 className="h-4 w-4 text-blue-500" />
        Institution / University
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const v = e.target.value
            setQuery(v)
            setIsOpen(true)
            setHighlightIdx(-1)
            if (!v) onChange('')
            else if (!INSTITUTIONS.includes(v)) onChange('')
          }}
          onFocus={() => {
            setIsOpen(true)
            if (value === 'Other') setQuery('')
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for your institution..."
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors hover:border-gray-300"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onChange(''); setIsOpen(true) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {filtered.length > 0 ? (
            filtered.map((inst, i) => (
              <li
                key={inst}
                onClick={() => handleSelect(inst)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  i === highlightIdx
                    ? 'bg-blue-50 text-blue-700'
                    : inst === value
                    ? 'bg-gray-50 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {inst}
              </li>
            ))
          ) : (
            <li className="px-3 py-4 text-sm text-gray-500 text-center">
              No match found.{' '}
              <button type="button" onClick={() => handleSelect('Other')} className="text-blue-600 hover:underline font-medium">
                Enter manually
              </button>
            </li>
          )}
        </ul>
      )}

      {value && value !== 'Other' && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <Check className="h-3 w-3" /> {value}
        </p>
      )}
    </div>
  )
}

// ─── Reusable Select (supports "Other" → custom text) ────
function SelectField({
  label, value, onChange, options, placeholder, icon: Icon,
  customValue, onCustomChange, customPlaceholder,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: string[]; placeholder: string
  icon?: React.ComponentType<{ className?: string }>
  customValue?: string; onCustomChange?: (v: string) => void
  customPlaceholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-500" />}
        {label}
      </Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors hover:border-gray-300"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {value === 'Other' && onCustomChange && (
        <Input
          placeholder={customPlaceholder || `Enter your ${label.toLowerCase()}`}
          value={customValue || ''}
          onChange={(e) => onCustomChange(e.target.value)}
          className="mt-1.5"
          autoFocus
        />
      )}
    </div>
  )
}

// ─── OTP Input (6 digits) ────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (idx: number, char: string) => {
    if (!/^\d?$/.test(char)) return
    const arr = value.split('')
    arr[idx] = char
    const next = arr.join('').slice(0, 6)
    onChange(next)
    if (char && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-11 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      ))}
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// ─── REGISTER PAGE ──────────────────────────────────────
// ═════════════════════════════════════════════════════════

// Steps: 0=Account, 1=Location & Affiliation, 2=Role & Research, 3=Email Verification
const TOTAL_FORM_STEPS = 3     // steps 0-2 are the form
const STEP_LABELS = ['Account', 'Affiliation', 'Research']
const STEP_DESCRIPTIONS = [
  'Create your account',
  'Where are you based?',
  'Your role & research focus',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 0 — Account
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 1 — Location & Affiliation (country FIRST, then institution)
  const [country, setCountry] = useState('India')
  const [customCountry, setCustomCountry] = useState('')
  const [state, setState] = useState('Tamil Nadu')
  const [customState, setCustomState] = useState('')
  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [institution, setInstitution] = useState('')
  const [customInstitution, setCustomInstitution] = useState('')
  const [department, setDepartment] = useState('')

  // Step 2 — Role & Research
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [researchArea, setResearchArea] = useState('')
  const [customResearchArea, setCustomResearchArea] = useState('')
  const [orcidId, setOrcidId] = useState('')

  // Step 3 — Email Verification
  const [verifyStep, setVerifyStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const nextStep = () => {
    setError('')
    if (step === 0) {
      if (!name.trim()) return setError('Full name is required')
      if (!email.trim()) return setError('Email is required')
      if (!validateEmail(email)) return setError('Please enter a valid email address')
      if (password.length < 8) return setError('Password must be at least 8 characters')
      if (password !== confirmPassword) return setError('Passwords do not match')
    }
    if (step === 1) {
      if (!country) return setError('Please select your country')
      if (country === 'Other' && !customCountry.trim()) return setError('Please enter your country name')
      if (!institution && !customInstitution.trim()) return setError('Please select or enter your institution')
      if (institution === 'Other' && !customInstitution.trim()) return setError('Please enter your institution name')
    }
    if (step === 2) {
      if (!role) return setError('Please select your role')
      if (role === 'Other' && !customRole.trim()) return setError('Please enter your role')
    }
    setStep((s) => Math.min(s + 1, TOTAL_FORM_STEPS - 1))
  }

  const prevStep = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  // Build the final field values
  const getFinalValues = () => {
    const finalCountry = country === 'Other' ? customCountry : country
    const finalInstitution = institution === 'Other' ? customInstitution : institution
    const finalRole = role === 'Other' ? customRole : role
    const finalResearchArea = researchArea === 'Other' ? customResearchArea : researchArea
    const finalState =
      country === 'India'
        ? state === 'Other' ? customState : state
        : customState
    let finalCity = customCity
    if (country === 'India' && state === 'Tamil Nadu') {
      finalCity = city === 'Other' ? customCity : city
    }
    return { finalCountry, finalInstitution, finalRole, finalResearchArea, finalState, finalCity }
  }

  // Submit registration → then go to verify step
  const handleRegister = async () => {
    // Final validation for step 2
    if (!role) { setError('Please select your role'); return }
    if (role === 'Other' && !customRole.trim()) { setError('Please enter your role'); return }

    setError('')
    setLoading(true)

    const { finalCountry, finalInstitution, finalRole, finalResearchArea, finalState, finalCity } = getFinalValues()

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          institution: finalInstitution || undefined,
          department: department.trim() || undefined,
          role: finalRole || undefined,
          researchArea: finalResearchArea || undefined,
          country: finalCountry || undefined,
          state: finalState || undefined,
          city: finalCity || undefined,
          orcidId: orcidId.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      // Move to email verification step
      setVerifyStep(true)
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ★ KEY FIX: Enter key on steps 0/1 advances the form; only step 2 triggers register
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyStep) {
      handleVerifyCode()
      return
    }
    if (step < TOTAL_FORM_STEPS - 1) {
      nextStep()
    } else {
      handleRegister()
    }
  }

  // Verify email code
  const handleVerifyCode = async () => {
    if (otp.length !== 6) { setError('Please enter the 6-digit code'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    setError('')
    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to resend code')
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ─── RENDER ────────────────────────────────────────────

  // ── Email Verification Screen ──
  if (verifyStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/60 to-white p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-gray-100">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                We sent a 6-digit verification code to<br />
                <span className="font-medium text-gray-700">{email.trim().toLowerCase()}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-6">
                  <OtpInput value={otp} onChange={setOtp} />

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white relative overflow-hidden"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white/30 border-t-white animate-spin"></span>
                        </span>
                        Verifying your email...
                      </span>
                    ) : (
                      <>Verify Email <Check className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0}
                      className={`text-sm font-medium inline-flex items-center gap-1.5 ${
                        resendCooldown > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 hover:underline'
                      }`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    Check your spam folder if you don't see the email
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Multi-step Registration Form ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/60 to-white p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg border-gray-100">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Join ResearchOS</CardTitle>
            <CardDescription className="text-gray-500">{STEP_DESCRIPTIONS[step]}</CardDescription>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: TOTAL_FORM_STEPS }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      i < step
                        ? 'bg-blue-600 text-white'
                        : i === step
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  {i < TOTAL_FORM_STEPS - 1 && (
                    <div className={`w-10 h-0.5 mx-1.5 rounded transition-colors duration-300 ${
                      i < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {STEP_LABELS.map((label, i) => (
                <span key={label} className={`text-xs transition-colors ${
                  i === step ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-8 px-8">
            <form onSubmit={handleFormSubmit}>

              {/* ═══════ STEP 0 — ACCOUNT ═══════ */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" /> Full Name
                    </Label>
                    <Input id="name" type="text" placeholder="Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {password ? (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${
                            password.length >= 12 ? 'w-full bg-green-500'
                            : password.length >= 8 ? 'w-2/3 bg-yellow-500'
                            : 'w-1/3 bg-red-400'
                          }`} />
                        </div>
                        <span className={`text-xs ${
                          password.length >= 12 ? 'text-green-600'
                          : password.length >= 8 ? 'text-yellow-600'
                          : 'text-red-500'
                        }`}>
                          {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Too short'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Must be at least 8 characters</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {confirmPassword && password && (
                      <p className={`text-xs flex items-center gap-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                        {password === confirmPassword
                          ? <><Check className="h-3 w-3" /> Passwords match</>
                          : 'Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════ STEP 1 — LOCATION & AFFILIATION ═══════ */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Country first */}
                  <SelectField
                    label="Country" value={country}
                    onChange={(v) => {
                      setCountry(v); setCustomCountry('')
                      if (v === 'India') { setState('Tamil Nadu') } else { setState(''); setCustomState('') }
                      setCity(''); setCustomCity('')
                    }}
                    options={COUNTRIES} placeholder="Select your country" icon={MapPin}
                    customValue={customCountry} onCustomChange={setCustomCountry} customPlaceholder="Enter your country name"
                  />

                  {/* State — India dropdown, others free text */}
                  {country === 'India' ? (
                    <SelectField
                      label="State" value={state}
                      onChange={(v) => { setState(v); setCustomState(''); setCity(''); setCustomCity('') }}
                      options={INDIA_STATES} placeholder="Select your state"
                      customValue={customState} onCustomChange={setCustomState} customPlaceholder="Enter your state name"
                    />
                  ) : country && country !== 'Other' ? (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">State / Province</Label>
                      <Input placeholder="Enter state or province" value={customState} onChange={(e) => setCustomState(e.target.value)} />
                    </div>
                  ) : null}

                  {/* City — TN dropdown, others free text */}
                  {country === 'India' && state === 'Tamil Nadu' ? (
                    <SelectField
                      label="City / District" value={city} onChange={setCity}
                      options={TAMIL_NADU_CITIES} placeholder="Select your city"
                      customValue={customCity} onCustomChange={setCustomCity} customPlaceholder="Enter your city name"
                    />
                  ) : (country === 'India' && state && state !== 'Other') || (country && country !== 'India' && country !== 'Other') ? (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">City</Label>
                      <Input placeholder="Enter your city" value={customCity} onChange={(e) => setCustomCity(e.target.value)} />
                    </div>
                  ) : null}

                  <div className="border-t border-gray-100 pt-4" />

                  {/* Institution — searchable */}
                  <InstitutionSearch value={institution} onChange={setInstitution} />
                  {institution === 'Other' && (
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700">Institution Name</Label>
                      <Input placeholder="Enter your institution name" value={customInstitution} onChange={(e) => setCustomInstitution(e.target.value)} autoFocus />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      Department / Lab <span className="text-xs text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Input placeholder="e.g., Department of Chemistry" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                </div>
              )}

              {/* ═══════ STEP 2 — ROLE & RESEARCH ═══════ */}
              {step === 2 && (
                <div className="space-y-4">
                  <SelectField
                    label="Role / Position" value={role}
                    onChange={(v) => { setRole(v); if (v !== 'Other') setCustomRole('') }}
                    options={ROLES} placeholder="Select your role" icon={GraduationCap}
                    customValue={customRole} onCustomChange={setCustomRole} customPlaceholder="Enter your role or position"
                  />

                  <SelectField
                    label="Research Area" value={researchArea}
                    onChange={(v) => { setResearchArea(v); if (v !== 'Other') setCustomResearchArea('') }}
                    options={RESEARCH_AREAS} placeholder="Select your primary research area" icon={FlaskConical}
                    customValue={customResearchArea} onCustomChange={setCustomResearchArea} customPlaceholder="Enter your research area"
                  />

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">
                      ORCID iD <span className="text-xs text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Input placeholder="0000-0000-0000-0000" value={orcidId} onChange={(e) => setOrcidId(e.target.value)} />
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600">
                      This helps us personalize your experience. You can update these later.
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mt-4">
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-11">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                {step < TOTAL_FORM_STEPS - 1 ? (
                  <Button type="button" onClick={nextStep} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
