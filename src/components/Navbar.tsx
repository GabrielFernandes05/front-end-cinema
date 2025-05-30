'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Film, User, LogOut, Menu, X, Library } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }

  useEffect(() => {
    checkAuthStatus()

    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    checkAuthStatus()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setIsMenuOpen(false)
    router.push('/')
    window.location.reload()
  }

  const NavLink = ({ href, children, className = "" }: {
    href: string,
    children: React.ReactNode,
    className?: string
  }) => (
    <Link
      href={href}
      onClick={() => setIsMenuOpen(false)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-700 hover:text-white text-zinc-300 h-9 px-4 py-2 ${className}`}
    >
      {children}
    </Link>
  )

  return (
    <Card className="bg-zinc-900 border-zinc-700 rounded-none border-b border-l-0 border-r-0 border-t-0">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-red-600 rounded-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Cinema Digital</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/">Início</NavLink>
          <NavLink href="/em-cartaz">Em Cartaz</NavLink>
          <NavLink href="/filmes" className="flex items-center gap-2">
            <Library className="w-4 h-4" />
            Catálogo
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink href="/perfil" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil
              </NavLink>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link href="/cadastro">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-700 bg-zinc-900 p-4 space-y-2">
          <NavLink href="/" className="w-full flex">Início</NavLink>
          <NavLink href="/em-cartaz" className="w-full flex">Em Cartaz</NavLink>
          <NavLink href="/filmes" className="w-full flex items-center gap-2">
            <Library className="w-4 h-4" />
            Catálogo
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink href="/perfil" className="w-full flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil
              </NavLink>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/login" className="w-full flex">Login</NavLink>
              <Link href="/cadastro" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
