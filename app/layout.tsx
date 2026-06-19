import './globals.css'

import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Providers from '@/components/context/providers.client'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'YouMark — Save YouTube for later',
  description: 'Bookmark, organize and revisit YouTube videos and playlists without the distractions.',
  icons: { apple: "/icon.svg" },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#7c3aed",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html >
  )
}
