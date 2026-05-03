import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = '8103676783:AAGnnUDAZjYqVUtoaSyuTgdGReWWdVH_yrg'
const CHAT_ID = '-1002806502052'

function parseDevice(ua: string): string {
    if (!ua) return '❓ Unknown'
    const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
    const isTablet = /iPad|Tablet/i.test(ua)
    let device = isTablet ? '📱 Tablet' : isMobile ? '📱 Mobile' : '🖥 Desktop'
    if (/Windows NT/i.test(ua)) device += ' · Windows'
    else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) device += ' · macOS'
    else if (/iPhone/i.test(ua)) device += ' · iPhone'
    else if (/iPad/i.test(ua)) device += ' · iPad'
    else if (/Android/i.test(ua)) device += ' · Android'
    if (/Edg\//i.test(ua)) device += ' / Edge'
    else if (/Firefox/i.test(ua)) device += ' / Firefox'
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) device += ' / Safari'
    else if (/Chrome/i.test(ua)) device += ' / Chrome'
    return device
}

export async function POST(req: NextRequest) {
    try {
        const { trackTitle, trackCategory, pageUrl, userAgent } = await req.json()

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'Unknown'

        // Geo lookup
        let country = 'Unknown'
        let city = ''
        try {
            const geo = await fetch(`https://ipapi.co/${ip}/json/`, {
                headers: { 'User-Agent': 'BallardBot/1.0' }
            })
            if (geo.ok) {
                const geoData = await geo.json()
                country = `${geoData.country_name || 'Unknown'} ${geoData.country_code ? `(${geoData.country_code})` : ''}`
                city = geoData.city || ''
            }
        } catch { /* silent */ }

        const device = parseDevice(userAgent || '')
        const location = [city, country].filter(Boolean).join(', ')

        const text = [
            '🎵 *Audio Played*',
            `🎧 Track: \`${trackTitle}\``,
            trackCategory ? `📂 Category: \`${trackCategory}\`` : null,
            `📄 Page: ${pageUrl}`,
            `🌍 Location: ${location}`,
            `🖥 Device: ${device}`,
            `🌐 IP: \`${ip}\``,
            `⏰ ${new Date().toUTCString()}`,
        ].filter(Boolean).join('\n')

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
        })

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
