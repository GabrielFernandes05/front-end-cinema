'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    token: string | null
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [])

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAuthenticated(false)
    }

    if (isLoading) {
        return null
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}