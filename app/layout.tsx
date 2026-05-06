import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VisitorNotifier from '@/components/VisitorNotifier'

export const metadata: Metadata = {
    metadataBase: new URL('https://www.ballardkelly.shop'),
    title: 'Ballard Kelly Scott - Premium Digital Themes',
    description: 'Premium WordPress & Shopify themes crafted for creators, agencies, and startups.',
    keywords: 'wordpress themes, shopify themes, digital products, website templates, premium themes',
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: '/favicon.png',
    },
    openGraph: {
        title: 'Ballard Kelly Scott - Premium Digital Themes',
        description: 'Premium WordPress & Shopify themes crafted for creators, agencies, and startups.',
        url: '/',
        siteName: 'Ballard Kelly Scott',
        images: [
            {
                url: '/story.jpg',
                width: 1200,
                height: 630,
                alt: 'Ballard Kelly Scott',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ballard Kelly Scott - Premium Digital Themes',
        description: 'Premium WordPress & Shopify themes crafted for creators, agencies, and startups.',
        images: ['/story.jpg'],
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
