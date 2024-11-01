'use client'

import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

const navItems = [
  { href: '/', label: 'Subir JSON' },
  { href: '/module-registry', label: 'Registro de Módulos' },
  { href: '/user-set', label: 'Sets de Usuarios' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-indigo-600">Modularize</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}