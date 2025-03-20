import './globals.css'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VideoEditify',
  description: 'Professional video editing service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <NextAuthProvider>
          <div className="min-h-full flex flex-col">
            <Navigation />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
} 