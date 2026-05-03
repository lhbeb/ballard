import Link from 'next/link'
import Image from 'next/image'
import { Flame } from 'lucide-react'
import LinkedInLink from './LinkedInLink'

export default function Footer() {
    return (
        <footer className="border-t border-[#e5e7eb] bg-[#f5f6f8] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Image src="/logo.svg" alt="Ballard Kelly Scott" width={144} height={43} className="h-11 w-auto" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Premium WordPress &amp; Shopify themes crafted for creators, agencies, and startups.
                        </p>
                        <a
                            href="mailto:roxanneamelia73@outlook.com"
                            className="inline-flex items-center gap-2 mt-3 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            roxanneamelia73@outlook.com
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ul className="space-y-2">
                                {[
                                    { label: 'Browse Audio', href: '/' },
                                    { label: 'Collections', href: '/collections' },
                                    { label: 'About', href: '/about' },
                                    { label: 'Admin Panel', href: '/admin' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-gray-400 hover:text-[#3b82f6] transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/privacy" className="hover:text-[#3b82f6] transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#3b82f6] transition-colors">Terms of Service</Link></li>
                                <li><Link href="/license" className="hover:text-[#3b82f6] transition-colors">License Agreement</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">© 2024 Ballard Kelly Scott. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <LinkedInLink className="text-gray-500 hover:text-gray-900 transition-colors" />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            Made with <Flame size={12} className="text-[#3b82f6]" /> for creators
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
