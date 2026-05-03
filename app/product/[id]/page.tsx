'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftCircle, Loader2, Box, Ticket, Zap, Download, ShoppingCart, CheckCircle, X, CreditCard, Lock, Mail, User } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

export default function ProductPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [activeImage, setActiveImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Checkout state
    const [showCheckout, setShowCheckout] = useState(false)
    const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'done'>('form')
    const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' })

    useEffect(() => {
        async function load() {
            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError || !data) {
                setError('Product not found.')
            } else {
                setProduct(data)
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0])
                } else if (data.thumbnail_url) {
                    setActiveImage(data.thumbnail_url)
                }
            }
            setLoading(false)
        }
        load()
    }, [id])

    function formatCard(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 16)
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    }

    function formatExpiry(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 4)
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
        return digits
    }

    function handleCheckoutSubmit(e: React.FormEvent) {
        e.preventDefault()
        setCheckoutStep('processing')

        // Simulate processing delay
        setTimeout(() => {
            setCheckoutStep('done')
            // Redirect to thank-you page after a beat
            setTimeout(() => {
                router.push(`/thankyou?product=${encodeURIComponent(product?.title || '')}&price=${product?.price || 0}`)
            }, 1500)
        }, 2500)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
                <Loader2 className="animate-spin mr-3" size={24} />
                Loading product...
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
                <Box size={48} className="opacity-40" />
                <p className="text-lg font-medium text-gray-900">{error || 'Product not found.'}</p>
                <Link href="/" className="text-sm text-[#3b82f6] hover:underline">← Back to homepage</Link>
            </div>
        )
    }

    const isFree = !product.price || product.price === 0

    return (
        <div className="min-h-screen bg-[#f5f6f8] text-gray-900">
            {/* Breadcrumb */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors mb-8">
                    <ArrowLeftCircle size={16} /> Back to Products
                </Link>
            </div>

            {/* Product Layout */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left — Image Gallery */}
                    <div className="w-full lg:w-1/2 flex-shrink-0">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#e5e7eb] shadow-2xl mb-4">
                            {activeImage ? (
                                <Image
                                    src={activeImage}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-white to-[#f5f6f8] flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-3xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                                        <Box size={44} className="text-[#3b82f6]/50" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails Row */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${activeImage === img ? 'border-[#3b82f6] shadow-md shadow-[#3b82f6]/20' : 'border-transparent hover:border-[#e5e7eb]'}`}
                                    >
                                        <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Details */}
                    <div className="flex-1 min-w-0 pt-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="mb-6">
                            {isFree ? (
                                <div className="inline-flex items-center gap-2 bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#3b82f6] text-lg font-bold px-4 py-2 rounded-xl">
                                    <Zap size={18} /> Free
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 bg-white border border-[#e5e7eb] text-gray-900 text-2xl font-bold px-5 py-2.5 rounded-xl">
                                    <Ticket size={18} className="text-[#3b82f6]" />
                                    ${product.price}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Description</h2>
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                    {product.description}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    if (isFree) {
                                        if (product.file_url) {
                                            window.open(product.file_url, '_blank')
                                        } else {
                                            alert("Download file not available yet.")
                                        }
                                    } else {
                                        setShowCheckout(true)
                                    }
                                }}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#3b82f6]/25 hover:scale-105"
                            >
                                {isFree ? (
                                    <><Download size={17} /> Download Free</>
                                ) : (
                                    <><ShoppingCart size={17} /> Buy Now — ${product.price}</>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mt-10 pt-8 border-t border-[#e5e7eb]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    'Fully responsive design',
                                    'Clean, modern codebase',
                                    'Easy to customize',
                                    'Regular updates included',
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                                        <CheckCircle size={14} className="text-[#3b82f6] flex-shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Checkout Modal ── */}
            {showCheckout && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => checkoutStep === 'form' && setShowCheckout(false)}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <div
                        className="relative z-10 bg-white border border-[#e5e7eb] rounded-3xl w-full max-w-lg shadow-2xl shadow-black/10 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Processing state */}
                        {checkoutStep === 'processing' && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-6">
                                    <Loader2 size={32} className="text-[#3b82f6] animate-spin" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing payment...</h3>
                                <p className="text-gray-500 text-sm">Please wait while we confirm your order.</p>
                            </div>
                        )}

                        {/* Success state */}
                        {checkoutStep === 'done' && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment successful!</h3>
                                <p className="text-gray-500 text-sm">Redirecting to your order confirmation...</p>
                            </div>
                        )}

                        {/* Checkout form */}
                        {checkoutStep === 'form' && (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                                            <CreditCard size={18} className="text-[#3b82f6]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">Checkout</h3>
                                            <p className="text-xs text-gray-400">{product.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                        <button onClick={() => setShowCheckout(false)} className="w-8 h-8 rounded-full bg-[#f5f6f8] flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full name</label>
                                        <div className="relative">
                                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email address</label>
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="you@email.com"
                                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Card number */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Card number</label>
                                        <div className="relative">
                                            <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={form.card}
                                                onChange={e => setForm({ ...form, card: formatCard(e.target.value) })}
                                                placeholder="4242 4242 4242 4242"
                                                maxLength={19}
                                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Expiry + CVC */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expiry</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.expiry}
                                                onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">CVC</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.cvc}
                                                onChange={e => setForm({ ...form, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                placeholder="123"
                                                maxLength={4}
                                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Pay button */}
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20 text-sm mt-2"
                                    >
                                        <Lock size={14} /> Pay ${product.price}
                                    </button>

                                    <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                                        <Lock size={10} /> Secured checkout · Your data is encrypted
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
