'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeftCircle, Save, Loader2, Box, Upload, X, CheckCircle } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const thumbInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [isFree, setIsFree] = useState(true)
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [productFile, setProductFile] = useState<File | null>(null)

    useEffect(() => {
        async function load() {
            const { data, error: e } = await supabase.from('products').select('*').eq('id', id).single()
            if (e || !data) { setError('Product not found.'); setLoading(false); return }
            setProduct(data)
            setExistingImages(data.images && data.images.length > 0 ? data.images : (data.thumbnail_url ? [data.thumbnail_url] : []))
            setTitle(data.title || '')
            setDescription(data.description || '')
            const free = !data.price || data.price === 0
            setIsFree(free)
            setPrice(free ? '' : String(data.price))
            setLoading(false)
        }
        load()
    }, [id])

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setNewImages(prev => [...prev, ...filesArray])
            setNewImagePreviews(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))])
        }
    }

    function handleProductFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setProductFile(e.target.files[0])
        }
    }

    function removeExistingImage(index: number) {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    function removeNewImage(index: number) {
        setNewImages(prev => prev.filter((_, i) => i !== index))
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
        if (thumbInputRef.current) thumbInputRef.current.value = ''
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!product) return
        setSaving(true)
        setError('')

        try {
            let updatedImages = [...existingImages]

            if (newImages.length > 0) {
                for (const img of newImages) {
                    const ext = img.name.split('.').pop()
                    const imgPath = `thumbnails/${id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
                    const { error: uploadErr } = await supabase.storage.from('audio').upload(imgPath, img, { upsert: true })
                    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`)
                    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(imgPath)
                    updatedImages.push(publicUrl)
                }
            }

            let thumbnailUrl = updatedImages.length > 0 ? updatedImages[0] : null

            let fileUrl = product.file_url
            if (productFile) {
                const ext = productFile.name.split('.').pop()
                const fileName = `${id}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
                const filePath = `products/${fileName}`

                const { error: fileUploadError } = await supabase.storage.from('audio').upload(filePath, productFile, { upsert: true })
                if (fileUploadError) throw new Error(`File upload failed: ${fileUploadError.message}`)

                const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(filePath)
                fileUrl = publicUrl
            }

            const { error: updateErr } = await supabase.from('products').update({
                title,
                description: description || null,
                price: isFree ? 0 : parseFloat(price) || 0,
                thumbnail_url: thumbnailUrl,
                images: updatedImages,
                file_url: fileUrl,
            }).eq('id', id)

            if (updateErr) throw new Error(updateErr.message)
            setSuccess(true)
            setTimeout(() => router.push('/admin/manage'), 1200)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.')
        } finally { setSaving(false) }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mr-3" size={24} /> Loading product...
        </div>
    )

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            <p>{error || 'Product not found.'}</p>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <Link href="/admin/manage" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors mb-4">
                    <ArrowLeftCircle size={16} /> Back to Manage Products
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-500 text-sm mt-1">Update product details</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Images */}
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-gray-900">Product Images</label>
                        <input ref={thumbInputRef} type="file" multiple accept=".webp,.jpg,.jpeg,.png" onChange={handleImageChange} className="hidden" id="thumb-upload" />
                        <label htmlFor="thumb-upload" className="inline-flex items-center gap-2 cursor-pointer bg-[#f5f6f8] hover:bg-[#e5e7eb] border border-[#e5e7eb] text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl transition-all">
                            <Upload size={14} /> Add Images
                        </label>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        {existingImages.map((url, idx) => (
                            <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#f5f6f8] border border-[#e5e7eb] flex-shrink-0 group">
                                <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
                                <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><X size={12} /></button>
                            </div>
                        ))}
                        {newImagePreviews.map((url, idx) => (
                            <div key={`new-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#f5f6f8] border border-[#e5e7eb] flex-shrink-0 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`New Image ${idx + 1}`} className="object-cover w-full h-full" />
                                <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><X size={12} /></button>
                                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">New</div>
                            </div>
                        ))}
                        {existingImages.length === 0 && newImages.length === 0 && (
                            <div className="w-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-xl text-gray-400">
                                <Box size={28} className="mb-2 opacity-50" />
                                <p className="text-sm">No images uploaded</p>
                            </div>
                        )}
                    </div>
                </div>


                {/* Digital Product File */}
                {isFree && (
                    <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-4">Digital Product File (.zip)</label>
                        <div className="flex items-start gap-5">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#f5f6f8] border border-[#e5e7eb] flex-shrink-0 flex items-center justify-center">
                                {productFile ? (
                                    <div className="text-[#3b82f6] text-center">
                                        <Box size={24} className="mx-auto mb-1" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500">New File</span>
                                    </div>
                                ) : product.file_url ? (
                                    <div className="text-emerald-500 text-center">
                                        <CheckCircle size={24} className="mx-auto mb-1" />
                                        <span className="text-[10px] uppercase font-bold text-gray-500">Uploaded</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-center">
                                        <Box size={24} className="mx-auto mb-1" />
                                        <span className="text-[10px] uppercase font-bold">No file</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-3">{product.file_url ? 'Replace the current .zip file' : 'No file yet'}</p>
                                <input ref={fileInputRef} type="file" accept=".zip" onChange={handleProductFileChange} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="inline-flex items-center gap-2 cursor-pointer bg-[#f5f6f8] hover:bg-[#e5e7eb] border border-[#e5e7eb] text-gray-400 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl transition-all">
                                    <Upload size={14} /> Choose File
                                </label>
                                {productFile && <p className="text-xs text-[#3b82f6] mt-2">{productFile.name}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Fields */}
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Description <span className="text-gray-500 font-normal">(optional)</span></label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 outline-none transition-colors resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Pricing</label>
                        <div className="flex items-center gap-3 mb-3">
                            <button type="button" onClick={() => { setIsFree(true); setPrice('') }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${isFree ? 'bg-[#3b82f6]/15 border-[#3b82f6]/50 text-[#3b82f6]' : 'bg-[#f5f6f8] border-[#e5e7eb] text-gray-400'}`}>Free</button>
                            <button type="button" onClick={() => setIsFree(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${!isFree ? 'bg-[#3b82f6]/15 border-[#3b82f6]/50 text-[#3b82f6]' : 'bg-[#f5f6f8] border-[#e5e7eb] text-gray-400'}`}>Paid</button>
                        </div>
                        {!isFree && (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <input type="number" min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="29.00" className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors" />
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                {success && <p className="text-[#3b82f6] text-sm bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl px-4 py-3">Saved! Redirecting...</p>}

                <button type="submit" disabled={saving || success} className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20">
                    {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save Changes</>}
                </button>
            </form>
        </div>
    )
}
