// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Contact — Form Demo',
  description: 'A beautiful Next.js form submission demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
