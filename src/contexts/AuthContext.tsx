'use client'

import { createContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface AuthContextProps {
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 7 })
        setIsAuthenticated(true)
        router.push('/')
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
