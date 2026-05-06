'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Ticket, Zap, Box } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

function ProductCard({ product }: { product: Product }) {
    const isFree = !product.price || product.price === 0

    return (
        <Link
            href={`/product/${product.id}`}
            className="group bg-[#ffffff] border border-[#e5e7eb] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#3b82f6]/10 hover:-translate-y-1 hover:border-[#3b82f6]/40"
        >
            {/* Thumbnail / Placeholder — clean, no overlays */}
            <div className="relative w-full aspect-[4/3] bg-[#f5f6f8] overflow-hidden">
                {product.thumbnail_url ? (
                    <Image
                        src={product.thumbnail_url}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#ffffff] to-[#f5f6f8] flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Box size={28} className="text-[#3b82f6]/60" />
                        </div>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#3b82f6] transition-colors line-clamp-1 mb-1.5">
                    {product.title}
                </h3>
                {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e7eb]">
                    <span className="text-xs font-semibold text-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        View →
                    </span>
                    {/* Price badge at bottom */}
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isFree
                            ? 'bg-[#3b82f6]/15 text-[#3b82f6]'
                            : 'bg-amber-500/15 text-amber-600'
                    }`}>
                        {isFree ? (
                            <><Zap size={10} /> Free</>
                        ) : (
                            <><Ticket size={10} /> ${product.price}</>
                        )}
                    </span>
                </div>
            </div>
        </Link>
    )
}

function ProductGridContent({
    limit,
    title = "Latest Products",
    subtitle = "Premium digital themes for your next project",
    filterType = 'all'
}: {
    limit?: number
    title?: string
    subtitle?: string
    filterType?: 'all' | 'free' | 'paid'
}) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const query = searchParams.get('q')?.toLowerCase().trim() ?? ''

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
            if (!error && data) {
                setProducts(data)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    let filtered = query
        ? products.filter(p =>
            p.title.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query))
        )
        : products

    if (limit && !query) {
        filtered = filtered.slice(0, limit)
    }

    if (filterType === 'free') {
        filtered = filtered.filter(p => !p.price || p.price === 0)
    } else if (filterType === 'paid') {
        filtered = filtered.filter(p => p.price && p.price > 0)
    }

    const freeProducts = filtered.filter(p => !p.price || p.price === 0)
    const paidProducts = filtered.filter(p => p.price && p.price > 0)

    const showFree = filterType === 'all' || filterType === 'free'
    const showPaid = filterType === 'all' || filterType === 'paid'

    return (
        <section id="product-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {query ? `Results for "${query}"` : title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {query ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found` : subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-[#ffffff] border border-[#e5e7eb] rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                    {products.length} Listed
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                    <Loader2 className="animate-spin mb-4" size={30} />
                    <p className="text-sm">Loading products...</p>
                </div>
            )}

            {/* No results */}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-20 text-gray-500 border border-[#e5e7eb] border-dashed rounded-3xl bg-[#f5f6f8]/50">
                    <Box size={40} className="mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                    <p className="text-sm">
                        {query ? "Try a different keyword or browse all products." : "No products have been listed yet."}
                    </p>
                </div>
            )}

            {/* Free Products */}
            {!loading && showFree && freeProducts.length > 0 && (
                <div id="freebies" className="mb-12 pt-8 -mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <Zap size={16} className="text-[#3b82f6]" />
                        <h3 className="text-lg font-bold text-gray-900">Free</h3>
                        <span className="text-xs text-gray-500 bg-[#f5f6f8] border border-[#e5e7eb] rounded-full px-2 py-0.5">{freeProducts.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {freeProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Paid Products */}
            {!loading && showPaid && paidProducts.length > 0 && (
                <div id="premium" className="mb-12 pt-8 -mt-8">
                    <div className="flex items-center gap-2 mb-5">
                        <Ticket size={16} className="text-amber-600" />
                        <h3 className="text-lg font-bold text-gray-900">Premium</h3>
                        <span className="text-xs text-gray-500 bg-[#f5f6f8] border border-[#e5e7eb] rounded-full px-2 py-0.5">{paidProducts.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {paidProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

export default function ProductGrid(props: {
    limit?: number
    title?: string
    subtitle?: string
    filterType?: 'all' | 'free' | 'paid'
}) {
    return (
        <Suspense fallback={
            <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <Loader2 className="animate-spin mb-4" size={30} />
                <p className="text-sm">Loading products...</p>
            </div>
        }>
            <ProductGridContent {...props} />
        </Suspense>
    )
}
