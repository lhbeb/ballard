'use client'

import { useState } from 'react'
import { Mail, ArrowUpRight, CheckCircle } from 'lucide-react'

export default function EmailSection() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setEmail('')
        }, 3000)
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-3xl p-8 sm:p-12 text-center">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center mx-auto mb-5">
                    <Mail size={24} className="text-[#3b82f6]" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get New Releases via Email</h2>
                <p className="text-sm text-gray-400 mb-7 max-w-sm mx-auto leading-relaxed">
                    Enter your email to be notified when new themes and digital products are released.
                </p>

                {submitted ? (
                    <div className="flex items-center justify-center gap-2 text-[#3b82f6] font-semibold">
                        <CheckCircle size={20} />
                        You&apos;re in! We&apos;ll notify you of new releases.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                id="email-section-input"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm"
                            />
                        </div>
                        <button
                            id="email-section-submit"
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#3b82f6]/25 hover:scale-105 whitespace-nowrap"
                        >
                            Subscribe <ArrowUpRight size={15} />
                        </button>
                    </form>
                )}

                <p className="text-[11px] text-gray-600 mt-4">No spam, unsubscribe anytime.</p>
            </div>
        </section>
    )
}
