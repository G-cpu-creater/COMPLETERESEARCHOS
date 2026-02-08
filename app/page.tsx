'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useCallback, useState } from "react"
import {
  ArrowRight,
  FolderOpen,
  GitBranch,
  LineChart,
  Shield,
  BarChart3,
  Beaker,
  Battery,
  Atom,
  ChevronRight,
  FlaskConical,
} from "lucide-react"

// ─── Scroll-reveal hook ──────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const children = el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '-40px', threshold: 0.1 }
    )
    children.forEach((child, i) => {
      ;(child as HTMLElement).style.transitionDelay = `${i * 0.08}s`
      observer.observe(child)
    })
    return () => observer.disconnect()
  }, [])

  return ref
}

// ─── Section wrapper ─────────────────────────────────────
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  )
}

// ═════════════════════════════════════════════════════════
export default function HomePage() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handler = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.classList.add('bg-white/80', 'backdrop-blur-xl', 'shadow-[0_1px_0_rgba(0,0,0,0.04)]')
          navRef.current.classList.remove('bg-transparent')
        } else {
          navRef.current.classList.remove('bg-white/80', 'backdrop-blur-xl', 'shadow-[0_1px_0_rgba(0,0,0,0.04)]')
          navRef.current.classList.add('bg-transparent')
        }
      }
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // ── Interactive Demo State ──────────────────────────────
  const [demoPhase, setDemoPhase] = useState<'idle' | 'dragging' | 'dropped' | 'plotting' | 'done'>('idle')
  const [demoTab, setDemoTab] = useState<'cv' | 'nyquist' | 'cycles'>('cv')
  const demoRef = useRef<HTMLDivElement>(null)
  const demoStarted = useRef(false)

  // Auto-start animation when demo scrolls into view
  useEffect(() => {
    const el = demoRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !demoStarted.current) {
        demoStarted.current = true
        // Start drag animation sequence
        setTimeout(() => setDemoPhase('dragging'), 600)
        setTimeout(() => setDemoPhase('dropped'), 2200)
        setTimeout(() => setDemoPhase('plotting'), 3000)
        setTimeout(() => setDemoPhase('done'), 4200)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Reset & replay demo
  const replayDemo = useCallback(() => {
    setDemoPhase('idle')
    setDemoTab('cv')
    setTimeout(() => setDemoPhase('dragging'), 600)
    setTimeout(() => setDemoPhase('dropped'), 2200)
    setTimeout(() => setDemoPhase('plotting'), 3000)
    setTimeout(() => setDemoPhase('done'), 4200)
  }, [])

  const features = [
    {
      icon: FolderOpen,
      title: "Smart File Management",
      desc: "Auto-organize instrument files by project, date, and technique. Import from any format \u2014 BioLogic, Gamry, Ivium, and more.",
      detail: "No more folders named final_v3_backup. Every file is tagged, searchable, and linked to its experiment.",
    },
    {
      icon: GitBranch,
      title: "Full Experiment Traceability",
      desc: "Every parameter, every condition, every result \u2014 tracked and linked. Reproduce any experiment instantly, even years later.",
      detail: "Version control built for research. See exactly what changed, when, and why.",
    },
    {
      icon: LineChart,
      title: "Real-Time Analysis",
      desc: "Visualize and compare data across experiments. Publication-ready plots with one click. No more Excel copy-paste.",
      detail: "Built-in tools for CV, EIS, battery cycling, and all major electrochemical techniques.",
    },
  ]

  const techniques = [
    { name: "Cyclic Voltammetry", desc: "Peak detection, scan rate analysis", icon: LineChart },
    { name: "EIS Analysis", desc: "Nyquist plots, equivalent circuit fitting", icon: BarChart3 },
    { name: "Battery Cycling", desc: "Charge-discharge, capacity fade tracking", icon: Battery },
    { name: "Tafel Analysis", desc: "Exchange current density, kinetics", icon: Atom },
    { name: "Chronoamperometry", desc: "Current transients, Cottrell analysis", icon: Beaker },
    { name: "Corrosion Studies", desc: "Polarization curves, Rp determination", icon: Shield },
  ]

  const instruments = [
    "BioLogic EC-Lab", "Gamry Framework", "Ivium", "CH Instruments",
    "Pine Research", "Metrohm Autolab", "PalmSens", "Zahner",
    "Neware", "Arbin", "MACCOR", "Landt", "Solartron",
    "Corrtest", "CSV / TXT / Excel",
  ]

  const steps = [
    { num: "01", title: "Connect", desc: "Link your instruments and import existing data files \u2014 any format, any vendor." },
    { num: "02", title: "Organize", desc: "Auto-categorize by technique, project, and date. Metadata captured automatically." },
    { num: "03", title: "Analyze", desc: "Visualize, compare, and export. Publication-ready results without spreadsheet gymnastics." },
  ]

  const stats = [
    { value: "15+", label: "Instrument formats" },
    { value: "6+", label: "Techniques supported" },
    { value: "< 1 min", label: "To get started" },
    { value: "0", label: "Data lock-in" },
  ]

  return (
    <div className="min-h-screen bg-white antialiased">

      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <FlaskConical className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-slate-900 tracking-tight">ResearchOS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", id: "features" },
              { label: "How It Works", id: "how-it-works" },
              { label: "Techniques", id: "techniques" },
              { label: "Early Access", id: "early-access" },
            ].map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleAnchorClick(e, id)}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 text-sm h-9">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 px-5 rounded-lg">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />

        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <div
            className="animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{ opacity: 0 }}
          >
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Early Access
            </span>
          </div>

          <h1
            className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]"
            style={{ opacity: 0 }}
          >
            The Research Data Platform for
            <br />
            <span className="gradient-text-animate">Electrochemistry</span>
          </h1>

          <p
            className="mt-8 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]"
            style={{ opacity: 0 }}
          >
            Organize experiments, manage instrument data, and never lose
            a result again &mdash; all in one workspace.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-[fadeInUp_0.6s_cubic-bezier(0.16,1,0.3,1)_0.3s_forwards]"
            style={{ opacity: 0 }}
          >
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-8 text-base rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works" onClick={(e) => handleAnchorClick(e, 'how-it-works')}>
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 h-12 px-7 text-base">
                See how it works
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </a>
          </div>

          <div
            className="mt-16 animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_0.5s_forwards]"
            style={{ opacity: 0 }}
          >
            <p className="text-center text-[12px] uppercase font-medium text-slate-300 tracking-widest mb-4">Trusted by researchers using</p>
            <div className="relative overflow-hidden max-w-3xl mx-auto">
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
              <div className="flex animate-marquee gap-8 items-center">
                {["BioLogic", "Gamry", "Ivium", "CH Instruments", "Neware", "Pine Research", "Metrohm Autolab", "PalmSens", "Zahner", "Arbin", "MACCOR", "Solartron", "BioLogic", "Gamry", "Ivium", "CH Instruments", "Neware", "Pine Research", "Metrohm Autolab", "PalmSens", "Zahner", "Arbin", "MACCOR", "Solartron"].map((name, i) => (
                  <span key={`${name}-${i}`} className="whitespace-nowrap text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors duration-300 cursor-default">{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <Section id="problem" className="py-28 bg-slate-50/70">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="reveal text-[13px] font-medium text-blue-500 uppercase tracking-widest mb-3">
              The Problem
            </p>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Research data management is broken
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "53%", text: "of research data becomes unfindable within two years", accent: "text-blue-600" },
              { stat: "70%", text: "of researchers repeat experiments due to poor records", accent: "text-purple-600" },
              { stat: "40%", text: "of lab time is wasted on file management, not research", accent: "text-blue-500" },
            ].map((item) => (
              <div
                key={item.stat}
                className="reveal group p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:shadow-lg hover:shadow-blue-50/50"
              >
                <div className={`text-6xl font-bold ${item.accent} mb-4 transition-transform duration-500 group-hover:scale-105 origin-left`}>
                  {item.stat}
                </div>
                <p className="text-base text-slate-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal mt-8 flex items-center justify-center gap-2 text-[13px] text-slate-400">
            <svg className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Data sourced from <a href="https://www.nature.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors">Nature</a>, <a href="https://journals.plos.org/plosone/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors">PLOS ONE</a>, and <a href="https://www.science.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors">Science</a> research studies on data management in academia.</span>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" className="py-28">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <p className="reveal text-[13px] font-medium text-blue-500 uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5">
              One platform. Every experiment.
            </h2>
            <p className="reveal text-xl text-slate-500 font-light max-w-2xl mx-auto">
              From the moment you collect data to the day you publish &mdash;
              everything stays organized, traceable, and accessible.
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col gap-12 items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-[42%] flex flex-col justify-center ${i % 2 === 0 ? 'reveal-left md:pr-6' : 'reveal-right md:pl-6'}`}>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    {feature.detail}
                  </p>
                </div>

                <div className={`w-full md:w-[58%] ${i % 2 === 0 ? 'reveal-right' : 'reveal-left'}`}>
                  <div className="w-full aspect-[3/2] rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-100/60 overflow-hidden group hover:border-blue-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-100/50 relative p-6">
                    {/* Mock UI Header */}
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-300/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-300/60" />
                        <div className="w-3 h-3 rounded-full bg-green-300/60" />
                      </div>
                      <div className="flex-1 h-7 rounded-md bg-white/60 border border-blue-100/40 flex items-center px-3">
                        <span className="text-[11px] text-slate-300 font-mono">researchos.app/{feature.title.toLowerCase().replace(/\s+/g, '-')}</span>
                      </div>
                    </div>
                    {/* Mock UI Content */}
                    {i === 0 && (
                      <div className="space-y-1.5">
                        {/* Sidebar + file list layout */}
                        <div className="flex gap-3 h-full">
                          {/* Mini sidebar */}
                          <div className="w-[90px] flex-shrink-0 space-y-2">
                            <div className="p-2.5 rounded-lg bg-blue-600/10 border border-blue-200/40">
                              <div className="w-full h-2 rounded bg-blue-400/60 mb-1" />
                              <div className="w-3/4 h-1.5 rounded bg-blue-300/40" />
                            </div>
                            {['Projects', 'Recent', 'Starred'].map((label, li) => (
                              <div key={li} className="px-2.5 py-2 rounded-md hover:bg-white/50 transition-colors">
                                <span className="text-[10px] text-slate-400 font-medium">{label}</span>
                              </div>
                            ))}
                            <div className="border-t border-blue-100/40 pt-2 mt-1">
                              <div className="px-2.5 py-1"><span className="text-[9px] text-slate-300 uppercase tracking-wider font-semibold">Tags</span></div>
                              {['CV', 'EIS', 'Battery'].map((tag, ti) => (
                                <div key={ti} className="px-2.5 py-0.5">
                                  <span className={`text-[9px] font-medium ${ti === 0 ? 'text-blue-500' : ti === 1 ? 'text-purple-500' : 'text-emerald-500'}`}>● {tag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* File list */}
                          <div className="flex-1 space-y-2">
                            {[
                              { name: 'CV-scan-rate-50mVs.mpt', size: '3.2 MB', tag: 'CV', tagColor: 'bg-blue-100 text-blue-600', date: 'Today, 2:34 PM', icon: '📊' },
                              { name: 'EIS-nyquist-1MHz.dta', size: '1.8 MB', tag: 'EIS', tagColor: 'bg-purple-100 text-purple-600', date: 'Today, 11:20 AM', icon: '📈' },
                              { name: 'battery-cycle-500.nda', size: '12.1 MB', tag: 'Battery', tagColor: 'bg-emerald-100 text-emerald-600', date: 'Yesterday', icon: '🔋' },
                              { name: 'tafel-analysis-final.csv', size: '0.9 MB', tag: 'CV', tagColor: 'bg-blue-100 text-blue-600', date: 'Jan 28', icon: '📋' },
                            ].map((file, fi) => (
                              <div key={fi} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${fi === 0 ? 'bg-blue-50/80 border-blue-200/60 shadow-sm' : 'bg-white/60 border-blue-50/60 hover:bg-white/80'}`}>
                                <span className="text-sm">{file.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[12px] font-semibold truncate ${fi === 0 ? 'text-slate-700' : 'text-slate-600'}`}>{file.name}</p>
                                  <p className="text-[10px] text-slate-300">{file.size} &bull; {file.date}</p>
                                </div>
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${file.tagColor}`}>{file.tag}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="space-y-2.5">
                        {/* Branch bar */}
                        <div className="flex items-center gap-3">
                          <div className="h-8 px-3.5 rounded-lg bg-blue-600 flex items-center gap-2">
                            <GitBranch className="h-3.5 w-3.5 text-white" />
                            <span className="text-[12px] font-semibold text-white">main</span>
                          </div>
                          <div className="h-8 px-3.5 rounded-lg bg-purple-100 border border-purple-200/60 flex items-center gap-2">
                            <GitBranch className="h-3.5 w-3.5 text-purple-500" />
                            <span className="text-[12px] font-semibold text-purple-600">experiment-v2</span>
                          </div>
                          <div className="ml-auto h-8 px-3 rounded-lg bg-white/70 border border-blue-100/60 flex items-center">
                            <span className="text-[11px] text-slate-400">3 versions</span>
                          </div>
                        </div>
                        {/* Timeline */}
                        <div className="relative pl-4">
                          <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-blue-400 via-purple-300 to-slate-200" />
                          {[
                            { msg: 'Changed scan rate → 50 mV/s', detail: 'Parameter: scan_rate | 20 → 50 mV/s', time: '2 hours ago', dot: 'bg-blue-500', user: 'You' },
                            { msg: 'Updated electrolyte concentration', detail: 'KOH concentration: 0.5M → 1.0M', time: 'Yesterday', dot: 'bg-purple-500', user: 'You' },
                            { msg: 'Added temperature control data', detail: 'New file: temp-log-25C.csv (340 KB)', time: '3 days ago', dot: 'bg-slate-300', user: 'Dr. Chen' },
                          ].map((item, mi) => (
                            <div key={mi} className={`relative flex items-start gap-3 p-3 rounded-lg mb-2 transition-all duration-300 ${mi === 0 ? 'bg-white/80 border border-blue-100/60 shadow-sm' : 'bg-white/40'}`}>
                              <div className={`w-3 h-3 rounded-full ${item.dot} border-2 border-white absolute -left-[13px] top-4 shadow-sm`} />
                              <div className="flex-1 ml-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                                    <span className="text-[8px] text-white font-bold">{item.user[0]}</span>
                                  </div>
                                  <span className="text-[11px] font-semibold text-slate-500">{item.user}</span>
                                  <span className="text-[10px] text-slate-300">{item.time}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-700 mt-1">{item.msg}</p>
                                <p className="text-[11px] text-slate-400 font-mono bg-slate-50/80 rounded px-2 py-1 mt-1.5 inline-block">{item.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {i === 2 && (
                      <div className="space-y-2" ref={demoRef}>
                        {/* Toolbar with clickable tabs */}
                        <div className="flex items-center gap-3">
                          <div className="flex bg-white/70 rounded-lg border border-blue-100/60 overflow-hidden">
                            {([['cv', 'CV Plot'], ['nyquist', 'Nyquist'], ['cycles', 'Cycles']] as const).map(([key, label]) => (
                              <button
                                key={key}
                                onClick={() => demoPhase === 'done' && setDemoTab(key as typeof demoTab)}
                                className={`h-8 px-4 flex items-center transition-colors text-[11px] font-semibold ${
                                  demoTab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-blue-50'
                                } ${demoPhase !== 'done' ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            {demoPhase === 'done' && (
                              <button onClick={replayDemo} className="h-7 px-3 rounded bg-white/70 border border-blue-100/60 flex items-center hover:bg-blue-50 transition-colors">
                                <span className="text-[10px] text-blue-500 font-semibold">↻ Replay</span>
                              </button>
                            )}
                            <div className="h-7 px-3 rounded bg-white/70 border border-blue-100/60 flex items-center">
                              <span className="text-[10px] text-slate-400">50 mV/s</span>
                            </div>
                            <div className={`h-7 px-3 rounded flex items-center transition-colors ${
                              demoPhase === 'done' ? 'bg-emerald-50 border border-emerald-200/60' : 'bg-slate-50 border border-slate-200/60'
                            }`}>
                              <span className={`text-[10px] font-semibold ${demoPhase === 'done' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {demoPhase === 'done' ? '● Plotted' : demoPhase === 'plotting' ? '◌ Plotting...' : '○ Ready'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Main plot area */}
                        <div className="relative bg-white/70 rounded-xl border border-blue-100/60 overflow-hidden aspect-[16/9]">

                          {/* ─── Phase: idle / dragging — Drop zone ─── */}
                          {(demoPhase === 'idle' || demoPhase === 'dragging') && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                              <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-all duration-500 ${
                                demoPhase === 'dragging' ? 'border-blue-400 bg-blue-50/60 scale-105' : 'border-slate-200 bg-white/40'
                              }`}>
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                  <span className="text-lg">📂</span>
                                </div>
                                <span className="text-[13px] text-slate-400 font-medium">Drag & drop your .mpr file here</span>
                                <span className="text-[11px] text-slate-300">or click to browse</span>
                              </div>

                              {/* Animated floating file that flies in */}
                              {demoPhase === 'dragging' && (
                                <div className="demo-file-drag absolute">
                                  <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-blue-200 px-4 py-3">
                                    <span className="text-base">📊</span>
                                    <div>
                                      <p className="text-[12px] font-bold text-slate-700">FeCN6_5mM_CV_50mVs.mpr</p>
                                      <p className="text-[10px] text-slate-400">3.2 MB • BioLogic EC-Lab</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* ─── Phase: dropped — File recognized ─── */}
                          {demoPhase === 'dropped' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 demo-fade-in">
                              <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3 bg-white rounded-lg shadow-md border border-blue-200 px-5 py-3">
                                  <span className="text-lg">📊</span>
                                  <div>
                                    <p className="text-[13px] font-bold text-slate-700">FeCN6_5mM_CV_50mVs.mpr</p>
                                    <p className="text-[11px] text-slate-400">BioLogic EC-Lab • 3 cycles • CV technique</p>
                                  </div>
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center ml-2">
                                    <span className="text-[10px]">✓</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="demo-loading-dot w-2 h-2 rounded-full bg-blue-500" />
                                  <div className="demo-loading-dot w-2 h-2 rounded-full bg-blue-500" style={{animationDelay: '0.15s'}} />
                                  <div className="demo-loading-dot w-2 h-2 rounded-full bg-blue-500" style={{animationDelay: '0.3s'}} />
                                  <span className="text-[11px] text-blue-500 font-medium ml-1">Parsing data...</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ─── Phase: plotting — Curve drawing in ─── */}
                          {demoPhase === 'plotting' && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="flex flex-col items-center gap-3 demo-fade-in">
                                <div className="demo-spinner w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600" />
                                <span className="text-[12px] text-blue-600 font-semibold">Generating plot...</span>
                              </div>
                            </div>
                          )}

                          {/* ─── Phase: done — Show actual plots ─── */}
                          {demoPhase === 'done' && (
                            <div className="absolute inset-0 demo-plot-reveal">
                              {/* ═══ CV PLOT — 5mM K₃[Fe(CN)₆] / 0.1M KCl / GC / 50mV/s ═══ */}
                              {demoTab === 'cv' && (
                                <div className="w-full h-full relative">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 z-10">
                                    <span className="text-[5.5px] text-slate-400 font-semibold whitespace-nowrap">Current / µA</span>
                                  </div>
                                  <svg className="w-full h-full" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid */}
                                    {[22, 38, 54, 70, 86, 102].map(y => <line key={`g${y}`} x1="32" y1={y} x2="270" y2={y} stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    {[66, 100, 134, 168, 202, 236].map(x => <line key={`g${x}`} x1={x} y1="12" x2={x} y2="118" stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    {/* Zero current line */}
                                    <line x1="32" y1="62" x2="270" y2="62" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3,2" />
                                    {/* Axes */}
                                    <line x1="32" y1="10" x2="32" y2="120" stroke="#94A3B8" strokeWidth="0.6" />
                                    <line x1="32" y1="120" x2="270" y2="120" stroke="#94A3B8" strokeWidth="0.6" />
                                    {/* Ticks */}
                                    {[22,38,54,70,86,102].map(y => <line key={`t${y}`} x1="29" y1={y} x2="32" y2={y} stroke="#94A3B8" strokeWidth="0.4" />)}
                                    {[66,100,134,168,202,236].map(x => <line key={`t${x}`} x1={x} y1="120" x2={x} y2="123" stroke="#94A3B8" strokeWidth="0.4" />)}

                                    {/*
                                      Real ferro/ferricyanide CV data:
                                      [Fe(CN)₆]³⁻ + e⁻ ⇌ [Fe(CN)₆]⁴⁻
                                      5 mM K₃[Fe(CN)₆] in 0.1 M KCl
                                      GC electrode, 50 mV/s, vs Ag/AgCl
                                      E₁/₂ = +0.230 V, ΔEp = 70 mV
                                      Epa = +0.265 V (ipa = +45 µA)
                                      Epc = +0.195 V (ipc = -43 µA)

                                      Coordinate mapping:
                                      E: -0.1V→x=32,  0.6V→x=270  (x = 32 + (E+0.1)/0.7 * 238)
                                      I: +50µA→y=12, -50µA→y=112  (y = 62 - I * 1.0)
                                    */}

                                    {/* Forward (anodic) scan: -0.1V → +0.6V */}
                                    <path
                                      className="demo-cv-draw"
                                      d="M32 63 L49 63 L66 62 L83 62 L93 61 L100 60 L107 59 L111 57 L114 55 L118 52 L122 48 L125 44 L129 39 L132 34 L136 28 L140 23 L144 19 L148 16 L151 14 L154 13 L156 14 L159 16 L162 20 L166 25 L170 30 L175 35 L180 39 L186 42 L193 44 L202 46 L212 47 L222 47 L236 48 L250 48 L262 48 L270 48"
                                      stroke="#2563EB" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    {/* Reverse (cathodic) scan: +0.6V → -0.1V */}
                                    <path
                                      className="demo-cv-draw-reverse"
                                      d="M270 51 L262 51 L250 52 L236 53 L222 54 L212 56 L202 57 L193 59 L186 62 L180 65 L175 69 L170 73 L166 78 L162 83 L159 88 L156 93 L154 98 L151 102 L148 105 L145 107 L142 108 L139 107 L136 104 L132 99 L129 94 L125 88 L122 84 L118 79 L114 76 L111 73 L107 71 L100 69 L93 67 L83 66 L66 65 L49 64 L32 63"
                                      stroke="#2563EB" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    {/* Semi-transparent fill between curves */}
                                    <path
                                      d="M32 63 L49 63 L66 62 L83 62 L93 61 L100 60 L107 59 L111 57 L114 55 L118 52 L122 48 L125 44 L129 39 L132 34 L136 28 L140 23 L144 19 L148 16 L151 14 L154 13 L156 14 L159 16 L162 20 L166 25 L170 30 L175 35 L180 39 L186 42 L193 44 L202 46 L212 47 L222 47 L236 48 L250 48 L262 48 L270 48 L270 51 L262 51 L250 52 L236 53 L222 54 L212 56 L202 57 L193 59 L186 62 L180 65 L175 69 L170 73 L166 78 L162 83 L159 88 L156 93 L154 98 L151 102 L148 105 L145 107 L142 108 L139 107 L136 104 L132 99 L129 94 L125 88 L122 84 L118 79 L114 76 L111 73 L107 71 L100 69 L93 67 L83 66 L66 65 L49 64 L32 63 Z"
                                      fill="#3B82F6" opacity="0.06"
                                    />

                                    {/* Epa marker at (+0.265V, +45µA) → (154, 13) */}
                                    <circle cx="154" cy="13" r="2.5" fill="white" stroke="#2563EB" strokeWidth="1" className="demo-marker-pop" />
                                    <text x="160" y="12" fill="#1E40AF" fontSize="6" fontWeight="700" fontFamily="system-ui" className="demo-marker-pop">Epa</text>
                                    <text x="160" y="18" fill="#64748B" fontSize="4" fontFamily="system-ui" className="demo-marker-pop">+0.265V</text>

                                    {/* Epc marker at (+0.195V, -43µA) → (142, 108) */}
                                    <circle cx="142" cy="108" r="2.5" fill="white" stroke="#2563EB" strokeWidth="1" className="demo-marker-pop" />
                                    <text x="148" y="107" fill="#1E40AF" fontSize="6" fontWeight="700" fontFamily="system-ui" className="demo-marker-pop">Epc</text>
                                    <text x="148" y="113" fill="#64748B" fontSize="4" fontFamily="system-ui" className="demo-marker-pop">+0.195V</text>

                                    {/* ipa / ipc dashed measurement lines */}
                                    <line x1="154" y1="62" x2="154" y2="15" stroke="#1E40AF" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.4" className="demo-marker-pop" />
                                    <line x1="142" y1="62" x2="142" y2="106" stroke="#1E40AF" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.4" className="demo-marker-pop" />

                                    {/* ipa label */}
                                    <text x="157" y="40" fill="#1E40AF" fontSize="5" fontWeight="600" fontFamily="system-ui" className="demo-marker-pop">ipa</text>
                                    {/* ipc label */}
                                    <text x="133" y="90" fill="#1E40AF" fontSize="5" fontWeight="600" fontFamily="system-ui" className="demo-marker-pop">ipc</text>

                                    {/* Scan direction arrows */}
                                    <polygon points="125,46 120,43 121,50" fill="#2563EB" opacity="0.5" className="demo-marker-pop" />
                                    <polygon points="125,80 130,83 129,76" fill="#2563EB" opacity="0.5" className="demo-marker-pop" />

                                    {/* E₁/₂ line */}
                                    <line x1="148" y1="10" x2="148" y2="120" stroke="#94A3B8" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.3" className="demo-marker-pop" />
                                    <text x="146" y="127" fill="#94A3B8" fontSize="3.5" fontFamily="system-ui" textAnchor="middle" className="demo-marker-pop">E½</text>

                                    {/* X-axis tick labels (Potential / V) */}
                                    <text x="32" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">-0.1</text>
                                    <text x="66" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.0</text>
                                    <text x="100" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.1</text>
                                    <text x="134" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.2</text>
                                    <text x="168" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.3</text>
                                    <text x="202" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.4</text>
                                    <text x="236" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.5</text>
                                    <text x="270" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.6</text>

                                    {/* Y-axis tick labels (Current / µA) */}
                                    <text x="28" y="14" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">50</text>
                                    <text x="28" y="30" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">30</text>
                                    <text x="28" y="46" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">15</text>
                                    <text x="28" y="64" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">0</text>
                                    <text x="28" y="80" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">-15</text>
                                    <text x="28" y="96" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">-30</text>
                                    <text x="28" y="114" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">-50</text>
                                  </svg>
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                    <span className="text-[5.5px] text-slate-400 font-semibold">Potential / V vs Ag|AgCl</span>
                                  </div>
                                  {/* Info card */}
                                  <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 border border-slate-100/80 shadow-sm demo-marker-pop">
                                    <p className="text-[6px] text-slate-500 font-bold">5 mM [Fe(CN)₆]³⁻/⁴⁻</p>
                                    <p className="text-[5px] text-slate-400">0.1M KCl · GC · 50 mV/s</p>
                                    <p className="text-[5px] text-blue-500 font-semibold mt-0.5">ΔEp = 70 mV · 1e⁻ reversible</p>
                                  </div>
                                </div>
                              )}

                              {/* ═══ NYQUIST (EIS) PLOT ═══ */}
                              {demoTab === 'nyquist' && (
                                <div className="w-full h-full relative demo-fade-in">
                                  <div className="absolute left-0.5 top-1/2 -translate-y-1/2 -rotate-90 z-10">
                                    <span className="text-[5.5px] text-slate-400 font-semibold whitespace-nowrap">−Z'' / Ω</span>
                                  </div>
                                  <svg className="w-full h-full" viewBox="0 0 280 130" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid */}
                                    {[20, 40, 60, 80, 100].map(y => <line key={`g${y}`} x1="35" y1={y} x2="268" y2={y} stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    {[75, 115, 155, 195, 235].map(x => <line key={`g${x}`} x1={x} y1="12" x2={x} y2="115" stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    {/* Axes */}
                                    <line x1="35" y1="12" x2="35" y2="118" stroke="#94A3B8" strokeWidth="0.6" />
                                    <line x1="35" y1="118" x2="268" y2="118" stroke="#94A3B8" strokeWidth="0.6" />
                                    {/* Ticks */}
                                    {[20,40,60,80,100].map(y => <line key={`t${y}`} x1="32" y1={y} x2="35" y2={y} stroke="#94A3B8" strokeWidth="0.4" />)}
                                    {[75,115,155,195,235].map(x => <line key={`t${x}`} x1={x} y1="118" x2={x} y2="121" stroke="#94A3B8" strokeWidth="0.4" />)}

                                    {/* Nyquist plot: semicircle (charge transfer) + Warburg line (45° diffusion) */}
                                    {/* Rs=10Ω, Rct=80Ω, Warburg tail */}
                                    {/* Semicircle from (Rs, 0) to (Rs+Rct, 0) with peak at half */}
                                    <path
                                      className="demo-eis-draw"
                                      d="M50 115 C50 114, 51 112, 52 110 C54 106, 57 100, 61 94 C65 88, 70 82, 76 76 C82 70, 89 65, 97 61 C105 57, 114 55, 123 55 C132 55, 141 57, 149 61 C157 65, 164 70, 170 77 C176 84, 180 91, 183 98 C186 105, 187 111, 188 115 L192 112 L198 108 L205 103 L213 97 L222 90 L232 82 L243 73 L255 63"
                                      stroke="#9333EA" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    {/* Data points on semicircle */}
                                    {[
                                      [50,115],[55,108],[62,96],[72,82],[85,70],[100,62],[115,56],[130,55],[145,58],[158,65],[170,77],[180,92],[186,108],[188,115]
                                    ].map(([cx,cy], di) => (
                                      <circle key={di} cx={cx} cy={cy} r="2" fill="#9333EA" opacity="0.7" className="demo-marker-pop" style={{animationDelay: `${di * 0.05}s`}} />
                                    ))}
                                    {/* Warburg data points */}
                                    {[
                                      [195,110],[205,103],[218,93],[235,80],[250,66]
                                    ].map(([cx,cy], di) => (
                                      <circle key={`w${di}`} cx={cx} cy={cy} r="2" fill="#9333EA" opacity="0.7" className="demo-marker-pop" style={{animationDelay: `${(14+di) * 0.05}s`}} />
                                    ))}

                                    {/* Labels */}
                                    <text x="45" y="114" fill="#64748B" fontSize="5" fontFamily="system-ui">Rs</text>
                                    <text x="115" y="50" fill="#7C3AED" fontSize="5.5" fontWeight="600" fontFamily="system-ui">Rct</text>
                                    <text x="230" y="60" fill="#7C3AED" fontSize="5" fontWeight="600" fontFamily="system-ui" fontStyle="italic">Warburg</text>
                                    {/* Fit line (dashed) */}
                                    <path d="M50 115 C50 114, 51 112, 52 110 C54 106, 57 100, 61 94 C65 88, 70 82, 76 76 C82 70, 89 65, 97 61 C105 57, 114 55, 123 55 C132 55, 141 57, 149 61 C157 65, 164 70, 170 77 C176 84, 180 91, 183 98 C186 105, 187 111, 188 115" stroke="#C084FC" strokeWidth="0.8" fill="none" strokeDasharray="3,2" opacity="0.6" />

                                    {/* Axis labels */}
                                    <text x="42" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">10</text>
                                    <text x="78" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">30</text>
                                    <text x="118" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">50</text>
                                    <text x="158" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">70</text>
                                    <text x="195" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">90</text>
                                    <text x="232" y="125" fill="#94A3B8" fontSize="5" fontFamily="system-ui">110</text>
                                    <text x="30" y="22" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">50</text>
                                    <text x="30" y="42" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">40</text>
                                    <text x="30" y="62" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">30</text>
                                    <text x="30" y="82" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">20</text>
                                    <text x="30" y="102" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">10</text>
                                    <text x="30" y="117" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">0</text>
                                  </svg>
                                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                                    <span className="text-[5.5px] text-slate-400 font-semibold">Z' / Ω</span>
                                  </div>
                                </div>
                              )}

                              {/* ═══ CYCLES OVERLAY — 3 CV scans of ferricyanide ═══ */}
                              {demoTab === 'cycles' && (
                                <div className="w-full h-full relative demo-fade-in">
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 z-10">
                                    <span className="text-[5.5px] text-slate-400 font-semibold whitespace-nowrap">Current / µA</span>
                                  </div>
                                  <svg className="w-full h-full" viewBox="0 0 280 140" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid */}
                                    {[22,38,54,70,86,102].map(y => <line key={`g${y}`} x1="32" y1={y} x2="270" y2={y} stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    {[66,100,134,168,202,236].map(x => <line key={`g${x}`} x1={x} y1="12" x2={x} y2="118" stroke="#F1F5F9" strokeWidth="0.3" />)}
                                    <line x1="32" y1="62" x2="270" y2="62" stroke="#CBD5E1" strokeWidth="0.4" strokeDasharray="3,2" />
                                    <line x1="32" y1="10" x2="32" y2="120" stroke="#94A3B8" strokeWidth="0.6" />
                                    <line x1="32" y1="120" x2="270" y2="120" stroke="#94A3B8" strokeWidth="0.6" />

                                    {/* Cycle 1 — blue (identical to main CV) */}
                                    <path d="M32 63 L66 62 L100 60 L114 55 L125 44 L136 28 L148 16 L154 13 L159 16 L170 30 L186 42 L212 47 L270 48 L270 51 L236 53 L212 56 L193 59 L180 65 L170 73 L162 83 L154 98 L148 105 L142 108 L136 104 L129 94 L122 84 L114 76 L107 71 L93 67 L66 65 L32 63" stroke="#3B82F6" strokeWidth="1.4" fill="none" opacity="0.9" />

                                    {/* Cycle 2 — purple (very slight shift — reversible system stabilizes quickly) */}
                                    <path d="M32 63 L66 62 L100 60 L114 56 L125 45 L136 29 L148 17 L154 14 L159 17 L170 31 L186 43 L212 48 L270 49 L270 52 L236 54 L212 57 L193 60 L180 66 L170 74 L162 84 L154 99 L148 106 L142 109 L136 105 L129 95 L122 85 L114 77 L107 72 L93 68 L66 66 L32 64" stroke="#8B5CF6" strokeWidth="1.3" fill="none" opacity="0.65" />

                                    {/* Cycle 3 — light purple (nearly overlapping — truly reversible) */}
                                    <path d="M32 63 L66 62 L100 61 L114 56 L125 46 L136 30 L148 18 L154 15 L159 18 L170 32 L186 43 L212 48 L270 49 L270 52 L236 54 L212 57 L193 60 L180 66 L170 74 L162 85 L154 100 L148 107 L142 110 L136 106 L129 96 L122 85 L114 77 L107 72 L93 68 L66 66 L32 64" stroke="#C084FC" strokeWidth="1.2" fill="none" opacity="0.45" />

                                    {/* Axis labels */}
                                    <text x="32" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">-0.1</text>
                                    <text x="100" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.1</text>
                                    <text x="168" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.3</text>
                                    <text x="236" y="128" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="middle">0.5</text>
                                    <text x="28" y="14" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">50</text>
                                    <text x="28" y="64" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">0</text>
                                    <text x="28" y="114" fill="#94A3B8" fontSize="4.5" fontFamily="system-ui" textAnchor="end">-50</text>
                                  </svg>
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                    <span className="text-[5.5px] text-slate-400 font-semibold">Potential / V vs Ag|AgCl</span>
                                  </div>
                                  {/* Cycle legend */}
                                  <div className="absolute top-2 right-2 flex flex-col gap-0.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1.5 border border-slate-100/80 shadow-sm">
                                    {[['#3B82F6','Cycle 1'],['#8B5CF6','Cycle 2'],['#C084FC','Cycle 3']].map(([c,l],ci) => (
                                      <div key={ci} className="flex items-center gap-1.5">
                                        <div className="w-3 h-[2px] rounded" style={{backgroundColor: c}} />
                                        <span className="text-[6px] text-slate-500 font-semibold">{l}</span>
                                      </div>
                                    ))}
                                    <p className="text-[5px] text-blue-500 mt-0.5">ipa/ipc ≈ 1.0 (reversible)</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* File info bar at bottom */}
                        {demoPhase === 'done' && (
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 rounded-lg border border-slate-100/60 demo-fade-in">
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm">📊</span>
                              <span className="text-[11px] font-semibold text-slate-600">FeCN6_5mM_CV_50mVs.mpr</span>
                              <span className="text-[10px] text-slate-400">3 cycles • 50 mV/s • 0.1M KCl</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="text-[10px] text-emerald-600 font-semibold">Parsed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="py-28 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <p className="reveal text-[13px] font-medium text-blue-500 uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              From raw data to insights in three steps
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-16 left-[calc(16.666%+24px)] right-[calc(16.666%+24px)] h-px bg-slate-200" />

            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((step) => (
                <div key={step.num} className="reveal text-center relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-slate-200 mb-6 relative z-10 transition-all duration-500 hover:border-blue-600 hover:bg-blue-600 group cursor-default">
                    <span className="text-base font-bold text-slate-400 group-hover:text-white transition-colors duration-300">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-base text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Techniques */}
      <Section id="techniques" className="py-28">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="reveal text-[13px] font-medium text-blue-500 uppercase tracking-widest mb-3">
              Techniques
            </p>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5">
              Built for every technique you use
            </h2>
            <p className="reveal text-lg text-slate-500 font-light max-w-xl mx-auto">
              Specialized analysis tools for each electrochemistry technique,
              with more being added regularly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techniques.map((t) => (
              <div
                key={t.name}
                className="reveal group flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all duration-400 hover:shadow-md hover:shadow-slate-100/50 cursor-default"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-blue-600">
                  <t.icon className="h-5 w-5 text-blue-600 transition-colors duration-300 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-400">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Instruments */}
      <Section className="py-28 bg-slate-50/70">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="reveal text-[13px] font-medium text-blue-500 uppercase tracking-widest mb-3">
              Compatibility
            </p>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5">
              Works with your instruments
            </h2>
            <p className="reveal text-lg text-slate-500 font-light">
              Import data from all major potentiostats and battery cyclers. No conversion needed.
            </p>
          </div>

          <div className="reveal flex flex-wrap justify-center gap-3">
            {instruments.map((inst) => (
              <span
                key={inst}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 cursor-default"
              >
                {inst}
              </span>
            ))}
          </div>
          <p className="reveal text-center text-sm text-slate-400 mt-6">
            + any instrument that exports CSV, TXT, or Excel files
          </p>
        </div>
      </Section>

      {/* Early Access — Before / After transformation */}
      <Section id="early-access" className="py-28 bg-slate-950 relative overflow-hidden">
        {/* Ambient gradient blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[13px] text-emerald-300 font-medium tracking-wide uppercase">Early Access — Limited Spots</span>
            </div>
            <h2 className="reveal text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
              Stop losing research data.<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Start making discoveries.</span>
            </h2>
            <p className="reveal text-slate-400 text-base leading-relaxed max-w-2xl mx-auto">
              See how ResearchOS transforms the way researchers work — from scattered files and lost metadata to a unified, intelligent workspace.
            </p>
          </div>

          {/* Before / After comparison cards */}
          <div className="reveal-scale grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* BEFORE card */}
            <div className="group relative rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/30 to-slate-900/50 p-10 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                    <span className="text-red-400 text-sm">✕</span>
                  </div>
                  <span className="text-[12px] font-bold text-red-400/80 tracking-widest uppercase">Without ResearchOS</span>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Files scattered across 5 different folders',
                    'Experiment metadata lost in paper notebooks',
                    'Hours spent reformatting data for plotting',
                    '"Which version of this analysis is correct?"',
                    'Manual copy-paste between instruments',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/40 shrink-0" />
                      <span className="text-sm text-slate-400 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                {/* Mock chaotic desktop */}
                <div className="mt-6 rounded-lg bg-slate-900/60 border border-slate-700/30 p-3 relative">
                  <div className="grid grid-cols-4 gap-1.5">
                    {['CV_final.csv','data(2).xlsx','thesis_v3.docx','Untitled.txt','Copy of exp...','IMG_2847.png','notes.md','backup_old/'].map((f,i) => (
                      <div key={i} className="bg-slate-800/60 rounded px-1.5 py-1 text-[6px] text-slate-500 truncate border border-slate-700/20">
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <p className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-red-400/50 font-medium">Desktop — 847 items</p>
                </div>
              </div>
            </div>

            {/* AFTER card */}
            <div className="group relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/50 p-10 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <span className="text-[12px] font-bold text-emerald-400/80 tracking-widest uppercase">With ResearchOS</span>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'All experiments in one organized workspace',
                    'Metadata auto-captured from instrument files',
                    'Instant, publication-ready plots from raw data',
                    'Full version history — every change tracked',
                    'Drag, drop, analyze — any instrument format',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                      <span className="text-sm text-slate-300 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                {/* Mock clean workspace */}
                <div className="mt-6 rounded-lg bg-slate-900/60 border border-emerald-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[7px] text-emerald-400/70 font-semibold uppercase tracking-wider">ResearchOS Workspace</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: '📁', name: 'CV Study — Fe(CN)₆', tag: '3 experiments', color: 'text-blue-400' },
                      { icon: '📁', name: 'EIS — Corrosion', tag: '12 datasets', color: 'text-purple-400' },
                      { icon: '📊', name: 'Publication Figures', tag: 'auto-generated', color: 'text-emerald-400' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded px-2 py-1.5 border border-slate-700/15">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px]">{f.icon}</span>
                          <span className="text-[8px] text-slate-300 font-medium">{f.name}</span>
                        </div>
                        <span className={`text-[6px] ${f.color} font-medium`}>{f.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="reveal text-center">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white h-14 px-10 text-base rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]">
                Request Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-[13px] text-slate-500">Free during early access</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[13px] text-slate-600">•</span>
                <span className="text-[13px] text-slate-500">No credit card required</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[13px] text-slate-600">•</span>
                <span className="text-[13px] text-slate-500">Cancel anytime</span>
              </div>
              <span className="sm:hidden text-[13px] text-slate-500">No credit card required · Cancel anytime</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="reveal text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{s.value}</div>
                <p className="text-sm text-slate-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="py-28">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="reveal text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-5">
            Ready to modernize your<br />research workflow?
          </h2>
          <p className="reveal text-xl text-slate-500 font-light mb-10 max-w-lg mx-auto">
            Join researchers who have stopped losing data
            and started making discoveries.
          </p>
          <div className="reveal">
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-13 px-9 text-base rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 mt-4">
              Free forever for individual researchers. No credit card required.
            </p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-14 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
                  <FlaskConical className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold text-slate-900">ResearchOS</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The research data platform for electrochemistry.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Features</a></li>
                <li><a href="#techniques" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Techniques</a></li>
                <li><a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Tutorials</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-slate-400">
              &copy; {new Date().getFullYear()} ResearchOS. Built for researchers, by researchers.
            </p>
            <div className="flex items-center gap-5">
              <span className="text-[13px] text-blue-500 font-medium">Early Access</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
