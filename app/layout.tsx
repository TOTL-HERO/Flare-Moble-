import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "./components/Providers"

export const metadata: Metadata = {
  title: "Flare - AI-Powered Ad Management",
  description: "Create stunning ads with AI assistance",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f5f0e8",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
