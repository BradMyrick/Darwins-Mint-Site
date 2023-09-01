import './globals.css'
import type { Metadata } from 'next'
import { Righteous, Handjet } from 'next/font/google'

declare global {
    interface Window {
        ethereum: any
    }
}

const righteous = Righteous({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-righteous',
})
const handjet = Handjet({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-handjet',
})

export const metadata: Metadata = {
    title: 'The Darwins NFT',
    description: 'The Darwins NFT minting page',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link
                    rel="manifest"
                    href="/site.webmanifest"
                />
                <link
                    rel="shortcut icon"
                    href="/favicon.ico"
                />
                <meta
                    name="msapplication-TileColor"
                    content="#da532c"
                />
                <meta
                    name="msapplication-config"
                    content="/browserconfig.xml"
                />
                <meta
                    name="theme-color"
                    content="#ffffff"
                />
            </head>
            <body
                className={`${righteous.variable} ${handjet.variable} bg-antiFlashWhite text-wenge`}
            >
                {children}
            </body>
        </html>
    )
}
