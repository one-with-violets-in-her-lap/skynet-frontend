import '@/app/globals.css'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Skynet',
    description: 'Fun AI website to waste your time on when bored',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body>{children}</body>
        </html>
    )
}
