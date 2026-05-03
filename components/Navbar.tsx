'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Menu, X, Zap, Store, Box, Home, Search } from 'lucide-react'
import LinkedInLink from './LinkedInLink'

function NavbarContent() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [query, setQuery] = useState('')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Sync input with URL on mount
    useEffect(() => {
        setQuery(searchParams.get('q') ?? '')
    }, [searchParams])

    function handleSearch(value: string) {
        setQuery(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        const target = pathname === '/' ? `/?${params}` : `/?${params}`
        router.replace(target, { scroll: false })
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#f5f6f8]/90 border-b border-[#e5e7eb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group flex-shrink-0">
                        <Image src="/logo.svg" alt="Ballard Kelly Scott" width={144} height={43} className="h-11 w-auto group-hover:opacity-80 transition-opacity" />
                    </Link>

                    {/* Search bar - center */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-auto">
                        <div className="relative w-full">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                id="navbar-search"
                                type="search"
                                placeholder="Search themes..."
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-[#ffffff] border border-[#e5e7eb] hover:border-[#d1d5db] focus:border-[#3b82f6] rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-1.5 font-medium group/link">
                            <Box size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Products</span>
                        </Link>
                        <Link href="/#freebies" className="flex items-center gap-1.5 font-medium group/link">
                            <Zap size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Freebies</span>
                        </Link>
                        <a
                            href="/shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-medium group/link"
                        >
                            <Store size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Shop</span>
                        </a>
                        <LinkedInLink className="flex items-center text-gray-400 hover:text-gray-900 transition-colors" />
                        <a
                            href="/bmc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:opacity-80 transition-opacity"
                            aria-label="Buy Me a Coffee"
                        >
                            <Image src="/BMC1.png" alt="Buy Me a Coffee" width={130} height={36} className="h-9 w-auto" />
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-[#ffffff] transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-[#e5e7eb] bg-[#f5f6f8]">
                    <div className="px-4 py-3 flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2 py-2 group/link" onClick={() => setMenuOpen(false)}>
                            <Box size={15} className="text-[#3b82f6] shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Products</span>
                        </Link>
                        <Link href="/#freebies" className="flex items-center gap-2 py-2 group/link" onClick={() => setMenuOpen(false)}>
                            <Zap size={15} className="text-[#3b82f6] shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Freebies</span>
                        </Link>
                        <a
                            href="/shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 py-2 group/link"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Store size={15} className="text-[#3b82f6] shrink-0" />
                            <span className="text-sm text-gray-600 group-hover/link:text-gray-900 transition-colors">Shop</span>
                        </a>
                        <a
                            href="/bmc"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Image src="/BMC1.png" alt="Buy Me a Coffee" width={120} height={34} className="h-8 w-auto" />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default function Navbar() {
    return (
        <Suspense fallback={<div className="h-16 bg-[#f5f6f8] border-b border-[#e5e7eb]" />}>
            <NavbarContent />
        </Suspense>
    )
}
