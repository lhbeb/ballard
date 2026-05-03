'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, KeyRound, Mail, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        // Artificial delay for UX
        await new Promise(r => setTimeout(r, 600))

        if (email === 'arvaradodotcom@gmail.com' && password === 'Localserver!!2') {
            document.cookie = "admin_session=true; path=/; max-age=86400" // 24-hour cookie
            router.push('/admin')
            router.refresh()
        } else {
            setErrorMsg('Invalid email or password.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#ffffff] border border-[#e5e7eb] rounded-3xl p-8 sm:p-10 shadow-2xl">

                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <Image src="/logo.svg" alt="Ballard Kelly Scott" width={168} height={50} className="h-12 w-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-400 text-sm text-center">Sign in to manage your digital products</p>
                </div>

                {/* Error Box */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                        <p>{errorMsg}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="arvaradodotcom@gmail.com"
                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 ml-1">Password</label>
                        <div className="relative">
                            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#f5f6f8] border border-[#e5e7eb] focus:border-[#3b82f6] rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!email || !password || loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:hover:bg-[#3b82f6] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#3b82f6]/20 mt-8"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={18} /> Signing in...</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

            </div>
        </div>
    )
}
