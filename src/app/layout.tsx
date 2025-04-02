import '@/app/globals.css'

import { Metadata } from 'next'
import { Footer } from '@/components/footer'

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
        <html lang="en">
            <body>
                <div className="min-h-screen flex flex-col">
                    <main className="grow">{children}</main>

                    <Footer />
                </div>
            </body>
        </html>
    )
}
