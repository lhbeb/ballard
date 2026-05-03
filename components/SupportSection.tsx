import Image from 'next/image'
import { Coffee, Store, Flame, Code, PenTool, Library } from 'lucide-react'

export default function SupportSection() {
    return (
        <section id="support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="relative overflow-hidden bg-white border border-[#e5e7eb] rounded-[2.5rem] shadow-sm p-8 sm:p-12 lg:p-16">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Text side - Left */}
                    <div className="flex-1 w-full">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full px-4 py-1.5 mb-8">
                            <Flame size={14} className="text-[#3b82f6]" />
                            <span className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider">Support My Work</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
                            Help Me Keep{' '}
                            <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                                Creating
                            </span>
                        </h2>

                        <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-10 max-w-2xl">
                            <p>
                                I design and build premium UI kits, website templates, and Shopify & WordPress themes, many of which I release for free. Your support helps me dedicate more time to crafting high-quality design resources.
                            </p>
                            <p>
                                You can also grab exclusive templates, component libraries, and design assets from my BuyMeACoffee shop, built specifically for designers and developers who want polished, production-ready work.
                            </p>
                            <p className="text-gray-900 font-semibold">
                                Every contribution fuels the next design. Thank you for supporting independent creators. 🙏
                            </p>
                        </div>

                        {/* What your support funds */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {[
                                { icon: Code, label: 'Clean code' },
                                { icon: PenTool, label: 'New designs' },
                                { icon: Library, label: 'Free templates' },
                            ].map(item => (
                                <div key={item.label} className="inline-flex items-center gap-2 bg-[#f5f6f8] border border-[#e5e7eb] rounded-xl px-4 py-2 text-sm text-gray-600 font-semibold">
                                    <item.icon size={14} className="text-[#3b82f6]" />
                                    {item.label}
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/bmc"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="support-buymeacoffee-btn"
                                className="inline-flex items-center justify-center gap-2 bg-[#FFDD00] hover:bg-[#f0cf00] text-[#0D0C22] font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#FFDD00]/25 hover:scale-105"
                            >
                                <Coffee size={18} />
                                Support on BuyMeACoffee
                            </a>
                            <a
                                href="/shop"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="support-shop-btn"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-[#e5e7eb] hover:border-[#3b82f6]/40 text-gray-700 font-bold px-8 py-4 rounded-xl transition-all duration-200"
                            >
                                <Store size={18} />
                                Visit Shop
                            </a>
                        </div>
                    </div>

                    {/* Photo - Right */}
                    <div className="relative w-full lg:w-[400px] xl:w-[450px] aspect-square lg:aspect-[4/5] flex-shrink-0">
                        {/* Offset decorative background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/20 to-transparent rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10" />
                        
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                            <Image
                                src="/story.jpg"
                                alt="Ballard Kelly Scott"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 1024px) 100vw, 450px"
                                quality={95}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
