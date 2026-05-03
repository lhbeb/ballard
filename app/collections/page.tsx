import Link from 'next/link'
import { Box, ArrowLeftCircle } from 'lucide-react'

export default function CollectionsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <Box size={48} className="mx-auto mb-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Collections</h1>
            <p className="text-gray-400 mb-8">Product collections coming soon.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#3b82f6] hover:underline">
                <ArrowLeftCircle size={14} /> Back to Products
            </Link>
        </div>
    )
}
