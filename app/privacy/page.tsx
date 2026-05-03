import Link from 'next/link'
import { ArrowLeftCircle } from 'lucide-react'

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors mb-8">
                <ArrowLeftCircle size={16} /> Back to Home
            </Link>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-400 mb-12">Last updated: March 2026</p>

            <div className="space-y-8 text-gray-600 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                    <p>At Ballard Kelly Scott, we respect your privacy. Our website is designed to provide free, high-quality audio resources without requiring you to create an account or provide personal information to browse or download sounds.</p>
                    <p className="mt-4">If you choose to subscribe to our newsletter, we collect your email address solely for the purpose of sending you updates about new audio drops and resources.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cookies and Analytics</h2>
                    <p>We use minimal cookies strictly necessary for the functioning of the website, such as managing the admin session for the site owner. We do not use third-party tracking cookies or sell your browsing data to advertisers.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Services</h2>
                    <p>Our website may contain links to third-party services, such as "Buy Me a Coffee" or "PayPal" for optional support and professional services. Please note that when you click on these links, you are directed to their respective platforms, and your interactions are governed by their privacy policies and terms of service.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                    <p>We implement standard security measures to protect the integrity of our website. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us at roxanneamelia73@outlook.com.</p>
                </section>
            </div>
        </div>
    )
}
