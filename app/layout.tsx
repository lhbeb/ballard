import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VisitorNotifier from '@/components/VisitorNotifier'

export const metadata: Metadata = {
    title: 'Ballard Kelly Scott - Premium Digital Themes',
    description: 'Premium WordPress & Shopify themes crafted for creators, agencies, and startups.',
    keywords: 'wordpress themes, shopify themes, digital products, website templates, premium themes',
    icons: {
        icon: '/favicon.png',
    },
    openGraph: {
        title: 'Ballard Kelly Scott - Premium Digital Themes',
        description: 'Premium WordPress & Shopify themes crafted for creators, agencies, and startups.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-[#f5f6f8] text-gray-900 antialiased">
                <VisitorNotifier />
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
