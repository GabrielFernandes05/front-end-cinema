'use client'

import Link from 'next/link'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { LogIn, User } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-red-900 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <Link href="/" className="text-2xl font-bold">
        Cinema Digital
      </Link>

      <ul className="flex gap-6 items-center">
        <li>
          <Link href="/em-cartaz" className="hover:underline font-bold">
            Em Cartaz
          </Link>
        </li>

        {!isAuthenticated ? (
          <>
            <li>
              <Link href="/login" className="flex items-center gap-1 hover:underline font-bold">
                <LogIn size={18} /> Entrar
              </Link>
            </li>
          </>
        ) : (
          <li className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:underline font-bold">
              <User size={18} /> Perfil
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-zinc-800 rounded shadow-lg py-2">
                <Link href="/perfil" className="block px-4 py-2 hover:bg-zinc-700">
                  Meu Perfil
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                >
                  Sair
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}
