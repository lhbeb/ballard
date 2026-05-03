'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Users, X, Mail, ArrowUpRight, CheckCircle, PenTool, Box, Zap } from 'lucide-react'

export default function ProfileHero() {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [following, setFollowing] = useState(false)

    function handleFollow() {
        if (following) {
            setFollowing(false)
            return
        }
        setShowModal(true)
    }

    function handleSubscribe(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
        setFollowing(true)

        // Notify via Telegram
        fetch('/api/notify-follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                pageUrl: window.location.href,
                userAgent: navigator.userAgent,
            }),
        }).catch(() => { })

        setTimeout(() => {
            setShowModal(false)
            setSubmitted(false)
            setEmail('')
        }, 2200)
    }

    const stats = [
        { label: 'Products', value: '12' },
        { label: 'Customers', value: '340+' },
        { label: 'Followers', value: '1.2K' },
    ]

    return (
        <>
            {/* ── Hero Section ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#e5e7eb] shadow-lg">
                            <Image
                                src="/avatarpng.jpg"
                                alt="Ballard Kelly Scott"
                                width={112}
                                height={112}
                                className="object-cover w-full h-full"
                                priority
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Ballard Kelly Scott
                            </h1>
                            <span className="inline-flex items-center gap-1 bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                                <PenTool size={10} /> UI/UX Designer
                            </span>
                        </div>

                        {/* Tagline */}
                        <p className="text-gray-500 text-sm leading-relaxed max-w-lg mb-4">
                            Crafting premium WordPress & Shopify themes for creators, agencies, and startups.
                            Browse free and paid digital products designed with modern aesthetics and clean code.
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center gap-6">
                            {stats.map(s => (
                                <div key={s.label} className="flex items-center gap-1.5">
                                    <span className="text-base font-bold text-gray-900">{s.value}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0 w-full md:w-auto">
                        <button
                            id="follow-btn"
                            onClick={handleFollow}
                            className={`inline-flex items-center justify-center gap-2 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 ${following
                                ? 'bg-white border border-[#3b82f6]/60 text-[#3b82f6]'
                                : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-lg shadow-[#3b82f6]/20 hover:scale-105'
                                }`}
                        >
                            {following ? (
                                <><CheckCircle size={15} /> Following</>
                            ) : (
                                <>Follow</>
                            )}
                        </button>
                        <a
                            href="#product-grid"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[#e5e7eb] text-gray-700 hover:text-gray-900 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm"
                        >
                            Browse Themes <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#e5e7eb] mt-10" />
            </section>

            {/* ── Newsletter Modal ── */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal card */}
                    <div
                        className="relative z-10 bg-white border border-[#e5e7eb] rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/10 animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            aria-label="Close"
                        >
                            <X size={15} />
                        </button>

                        {submitted ? (
                            /* Success state */
                            <div className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-[#3b82f6]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re in! 🎉</h3>
                                <p className="text-gray-500 text-sm">Welcome! You&apos;ll be notified of new product releases.</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#3b82f6]/30 flex-shrink-0">
                                        <Image src="/avatarpng.jpg" alt="Ballard Kelly Scott" width={48} height={48} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Ballard Kelly Scott</div>
                                        <div className="text-[11px] text-[#3b82f6]">invites you to follow</div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="inline-flex items-center gap-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full px-3 py-1 mb-3">
                                        <Mail size={12} className="text-[#3b82f6]" />
                                        <span className="text-xs font-semibold text-[#3b82f6]">Newsletter</span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
                                        Get new releases<br />delivered to you ✨
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Enter your email to follow and receive new theme releases and product updates.
                                    </p>
                                </div>

                                <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="newsletter-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm"
                                        />
                                    </div>
                                    <button
                                        id="newsletter-submit"
                                        type="submit"
                                        className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/20"
                                    >
                                        Become a Follower
                                        <ArrowUpRight size={16} />
                                    </button>
                                    <p className="text-[11px] text-gray-400 text-center">No spam, unsubscribe anytime.</p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
