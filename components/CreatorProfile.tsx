import { MapPin, Calendar, Users, Download, Eye, Box, Star } from 'lucide-react'

const stats = [
    { icon: Star, label: 'Rating', value: '4.9' },
    { icon: Eye, label: 'Views', value: '18K' },
    { icon: Download, label: 'Sales', value: '340+' },
    { icon: Box, label: 'Products', value: '12' },
]

export default function CreatorProfile() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-14">
            <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
                            R
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3b82f6] border-2 border-[#ffffff]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Ballard Kelly Scott Media</h2>
                            <span className="inline-flex items-center gap-1 bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                ✓ Creator
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-3">
                            Sharing high-quality, royalty-free audio and media resources for creators worldwide. All tracks are free to use in your projects.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#3b82f6]" />
                                Worldwide
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#3b82f6]" />
                                Joined Jan 2020
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users size={12} className="text-[#3b82f6]" />
                                28.5K Followers
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full sm:w-auto">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-[#f5f6f8] border border-[#e5e7eb] rounded-xl p-3 text-center min-w-[80px]">
                                <stat.icon size={16} className="text-[#3b82f6] mx-auto mb-1.5" />
                                <div className="text-base font-bold text-gray-900">{stat.value}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
