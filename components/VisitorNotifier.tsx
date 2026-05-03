'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorNotifier() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't notify for admin page visits
        if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return

        fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path: window.location.href,
                referrer: document.referrer || null,
                userAgent: navigator.userAgent,
            }),
        }).catch(() => { /* silent fail */ })
    }, [pathname])

    return null
}
