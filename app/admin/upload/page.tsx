'use client'
export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, FileImage, CheckCircle, ArrowLeftCircle, Loader2, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AddProductPage() {
    const router = useRouter()
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [isFree, setIsFree] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [productFile, setProductFile] = useState<File | null>(null)

    // Status
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImages(Array.from(e.target.files))
        }
    }

    function handleProductFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setProductFile(e.target.files[0])
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title) {
            setErrorMsg("Please enter a product title.")
            return
        }

        try {
            setUploading(true)
            setErrorMsg('')
            setProgress(20)

            // 1. Upload images if provided
            let thumbnailUrl = null
            let uploadedImagesUrls: string[] = []

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const img = images[i];
                    const ext = img.name.split('.').pop()
                    const imgName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
                    const imgPath = `thumbnails/${imgName}`

                    const { error: uploadError } = await supabase.storage
                        .from('audio')
                        .upload(imgPath, img, { cacheControl: '3600', upsert: false })

                    if (uploadError) throw new Error(`Image upload error: ${uploadError.message}`)
                    const { data } = supabase.storage.from('audio').getPublicUrl(imgPath)
                    uploadedImagesUrls.push(data.publicUrl)
                    
                    // Update progress incrementally
                    setProgress(20 + Math.floor(((i + 1) / images.length) * 40))
                }
                thumbnailUrl = uploadedImagesUrls[0]
            }
            setProgress(60)

            // 2. Upload product .zip file if free and provided
            let fileUrl = null
            if (isFree && productFile) {
                const ext = productFile.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
                const filePath = `products/${fileName}`

                const { error: fileUploadError } = await supabase.storage
                    .from('audio')
                    .upload(filePath, productFile, { cacheControl: '3600', upsert: false })

                if (fileUploadError) throw new Error(`Product file upload error: ${fileUploadError.message}`)
                const { data } = supabase.storage.from('audio').getPublicUrl(filePath)
                fileUrl = data.publicUrl
            }
            setProgress(80)

            // 3. Insert into database
            const { error: dbError } = await supabase
                .from('products')
                .insert({
                    title,
                    description: description || null,
                    price: isFree ? 0 : parseFloat(price) || 0,
                    thumbnail_url: thumbnailUrl,
                    images: uploadedImagesUrls,
                    file_url: fileUrl,
                })

            if (dbError) throw new Error(`Database error: ${dbError.message}`)

            setProgress(100)
            setSuccess(true)

            // Reset form after delay
            setTimeout(() => {
                setTitle('')
                setDescription('')
                setPrice('')
                setIsFree(true)
                setImages([])
                setProductFile(null)
                setProgress(0)
                setUploading(false)
                setSuccess(false)
                if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
                if (fileInputRef.current) fileInputRef.current.value = ''
            }, 2000)

        } catch (error: any) {
            console.error(error)
            setErrorMsg(error.message || "An unexpected error occurred.")
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors mb-4">
                    <ArrowLeftCircle size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center border border-[#3b82f6]/30">
                        <PlusCircle size={18} className="text-[#3b82f6]" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-3xl p-6 sm:p-10 shadow-2xl">

                {success && (
                    <div className="mb-8 p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-xl flex items-center gap-3 text-[#60a5fa]">
                        <CheckCircle className="flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Product Published!</p>
                            <p className="text-sm opacity-80">Your product is now live on the site.</p>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Product Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={uploading}
                            required
                            placeholder="e.g. Starter — Minimal WordPress Theme"
                            className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Description <span className="text-gray-600">(optional)</span></label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            disabled={uploading}
                            rows={4}
                            placeholder="Describe your product — features, what's included, platform compatibility..."
                            className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-600">Pricing</label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsFree(true); setPrice('') }}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                                    isFree
                                        ? 'bg-[#3b82f6]/15 border-[#3b82f6]/50 text-[#3b82f6]'
                                        : 'bg-[#f5f6f8] border-[#e5e7eb] text-gray-400 hover:border-gray-500'
                                }`}
                            >
                                Free
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFree(false)}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border ${
                                    !isFree
                                        ? 'bg-[#3b82f6]/15 border-[#3b82f6]/50 text-[#3b82f6]'
                                        : 'bg-[#f5f6f8] border-[#e5e7eb] text-gray-400 hover:border-gray-500'
                                }`}
                            >
                                Paid
                            </button>
                        </div>
                        {!isFree && (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    disabled={uploading}
                                    placeholder="29.00"
                                    className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    {/* Thumbnail (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Product Images <span className="text-gray-600">(optional)</span></label>
                        <div
                            className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors
                                ${images.length > 0 ? 'border-[#3b82f6]/50 bg-[#3b82f6]/5' : 'border-[#e5e7eb] hover:border-gray-500 bg-[#f5f6f8]/50'}`}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleImageChange}
                                ref={thumbnailInputRef}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />

                            {images.length > 0 ? (
                                <>
                                    <div className="flex gap-2 mb-3 max-w-full overflow-x-auto pb-2 px-2">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={URL.createObjectURL(img)} alt={img.name} className="object-cover w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-gray-900 font-medium text-center text-sm">{images.length} images selected</p>
                                    <p className="text-xs text-[#3b82f6] mt-2 font-medium">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-[#e5e7eb] text-gray-400 flex items-center justify-center mb-2">
                                        <Upload size={18} />
                                    </div>
                                    <p className="text-gray-600 font-medium text-center text-sm">Upload preview image</p>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Digital Product File (for free products) */}
                    {isFree && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Digital Product File (.zip) <span className="text-gray-600">(optional)</span></label>
                            <div
                                className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors
                                    ${productFile ? 'border-[#3b82f6]/50 bg-[#3b82f6]/5' : 'border-[#e5e7eb] hover:border-gray-500 bg-[#f5f6f8]/50'}`}
                            >
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleProductFileChange}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                />

                                {productFile ? (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-[#3b82f6]/20 mb-2">
                                            <Upload size={20} />
                                        </div>
                                        <p className="text-gray-900 font-medium text-center text-sm">{productFile.name}</p>
                                        <p className="text-xs text-[#3b82f6] mt-2 font-medium">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-[#e5e7eb] text-gray-400 flex items-center justify-center mb-2">
                                            <Upload size={18} />
                                        </div>
                                        <p className="text-gray-600 font-medium text-center text-sm">Upload product .zip</p>
                                        <p className="text-xs text-gray-500 mt-1">Provide the file for users to download</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="w-full bg-[#f5f6f8] rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-[#e5e7eb]">
                        <button
                            type="submit"
                            disabled={!title || uploading || success}
                            className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:hover:bg-[#3b82f6] text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20"
                        >
                            {uploading ? (
                                <><Loader2 className="animate-spin" size={20} /> Publishing... {progress}%</>
                            ) : success ? (
                                <><CheckCircle size={20} /> Published</>
                            ) : (
                                <>Publish Product</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
