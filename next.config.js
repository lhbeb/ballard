/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        qualities: [75, 90, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pihwxdkhsopjyedarqxd.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https://*.supabase.co",
                            "media-src 'self' https://*.supabase.co",
                            "connect-src 'self' https://*.supabase.co https://ipapi.co https://api.telegram.org",
                            "frame-ancestors 'none'",
                        ].join('; '),
                    },
                ],
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/bmc',
                destination: 'https://buymeacoffee.com/kellyscott',
                permanent: false,
            },
            {
                source: '/shop',
                destination: 'https://buymeacoffee.com/kellyscott',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
