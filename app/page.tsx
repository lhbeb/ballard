import HeroSection from '@/components/HeroSection'
import ProductGrid from '@/components/ProductGrid'
import SupportSection from '@/components/SupportSection'
import SocialLinks from '@/components/SocialLinks'

export default function HomePage() {
    return (
        <div>
            {/* Profile Hero (cover + avatar + follow) */}
            <HeroSection />

            {/* Freebies */}
            <ProductGrid
                title="Freebies"
                subtitle="High-quality free themes to get you started"
                filterType="free"
            />

            {/* Support / Donation */}
            <SupportSection />

            {/* Premium Products */}
            <ProductGrid
                title="Premium Digital Products"
                subtitle="Premium WordPress & Shopify themes for your next project"
                filterType="paid"
            />

            {/* Email Subscription */}
            <SocialLinks />
        </div>
    )
}
