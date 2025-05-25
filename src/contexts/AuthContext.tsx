'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { useSearchParams, useRouter } from 'next/navigation'

interface AuthContextProps {
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 1/12 })

        const redirect = searchParams.get('redirect') || '/'

        setIsAuthenticated(true)
        router.push(redirect)
    }

    const logout = () => {
        Cookies.remove('token')
        setIsAuthenticated(false)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
