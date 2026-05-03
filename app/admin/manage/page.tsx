'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftCircle, Trash2, Box, Loader2, Pencil, Zap, Ticket } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

export default function ManageProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => { fetchProducts() }, [])

    async function fetchProducts() {
        setLoading(true)
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (!error && data) setProducts(data)
        setLoading(false)
    }

    async function handleDelete(id: string, thumbUrl: string | null) {
        if (!confirm('Delete this product? This cannot be undone.')) return
        try {
            setDeletingId(id)
            if (thumbUrl) {
                const p = thumbUrl.split('/audio/')
                if (p.length > 1) await supabase.storage.from('audio').remove([p[1]])
            }
            await supabase.from('products').delete().eq('id', id)
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch { alert('Failed to delete.') }
        finally { setDeletingId(null) }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors mb-4">
                    <ArrowLeftCircle size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center border border-[#3b82f6]/30">
                        <Box size={18} className="text-[#3b82f6]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="py-20 flex flex-col justify-center items-center text-gray-500">
                        <Loader2 className="animate-spin mb-4" size={30} /><p>Loading...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <Box className="mx-auto mb-4 opacity-50" size={40} />
                        <p className="text-lg font-medium text-gray-600">No products yet</p>
                        <p className="mb-6 mt-1">Add your first product to get started.</p>
                        <Link href="/admin/upload" className="inline-flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-6 py-2.5 rounded-xl transition-all">Add First Product</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-[#e5e7eb]">
                        {products.map((product) => {
                            const isFree = !product.price || product.price === 0
                            return (
                                <div key={product.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f0f2f5] transition-colors">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f6f8] border border-[#e5e7eb] flex-shrink-0">
                                        {product.thumbnail_url ? (
                                            <Image src={product.thumbnail_url} alt={product.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#eef2ff] to-[#f5f6f8]">
                                                <Box size={20} className="text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{product.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${isFree ? 'bg-[#3b82f6]/15 text-[#3b82f6]' : 'bg-amber-500/15 text-amber-600'}`}>
                                                {isFree ? <><Zap size={8} /> Free</> : <><Ticket size={8} /> ${product.price}</>}
                                            </span>
                                            <span className="text-xs text-gray-600">{new Date(product.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link href={`/admin/edit/${product.id}`} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 hover:bg-[#e5e7eb] px-3 py-1.5 rounded-lg transition-colors text-sm" title="Edit"><Pencil size={14} /> Edit</Link>
                                        <button onClick={() => handleDelete(product.id, product.thumbnail_url)} disabled={deletingId === product.id} className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm" title="Delete">
                                            {deletingId === product.id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />} Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
