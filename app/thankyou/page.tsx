'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowUpRight, Download, Box, Home } from 'lucide-react'

function ThankYouContent() {
    const searchParams = useSearchParams()
    const productName = searchParams.get('product') || 'your product'
    const price = searchParams.get('price') || '0'

    return (
        <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Success icon */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={40} className="text-emerald-500" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Thank you for your order!
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed max-w-md mx-auto">
                    Your purchase of <strong className="text-gray-900">{productName}</strong> for{' '}
                    <strong className="text-gray-900">${price}</strong> has been confirmed.
                    A confirmation email will be sent to you shortly.
                </p>

                {/* Order summary card */}
                <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 mb-8 text-left shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                            <Box size={18} className="text-[#3b82f6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{productName}</p>
                            <p className="text-xs text-gray-400">Digital product · Instant delivery</p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">${price}</span>
                    </div>
                    <div className="border-t border-[#e5e7eb] pt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Order number</span>
                            <span className="font-mono text-gray-900 text-xs">#{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                                <CheckCircle size={12} /> Completed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Download CTA */}
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#3b82f6]/20 hover:scale-105 mb-3">
                    <Download size={17} /> Download Product
                </button>

                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#3b82f6] transition-colors py-3"
                >
                    <Home size={14} /> Back to Homepage <ArrowUpRight size={12} />
                </Link>
            </div>
        </div>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                Loading...
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    )
}
