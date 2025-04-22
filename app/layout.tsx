import type React from "react"
import "./globals.css"

export const metadata = {
  title: "Scholarship Exam",
  description: "Engineering scholarship examination platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
