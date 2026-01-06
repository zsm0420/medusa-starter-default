import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MedusaProvider, CartProvider } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Medusa Storefront',
  description: 'A modern ecommerce storefront built with Next.js and Medusa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MedusaProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </MedusaProvider>
      </body>
    </html>
  )
}
