import React from "react"
import type { Metadata } from 'next'
import { Inter, Geist_Mono as GeistMono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geistMono = GeistMono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Retarget IQ Support Assistant',
  description: 'AI-powered assistant for Retarget IQ support staff',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
