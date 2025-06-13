'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/utils/axios'
import Background from '@/components/background'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Film, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get('redirect') || '/'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
        if (error) setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            setError('Preencha todos os campos')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await login(form.email, form.password)

            if (response.status === 200 && response.data) {
                const token = response.data.data || response.data

                if (token && typeof token === 'string') {
                    localStorage.setItem('token', token)
                    window.dispatchEvent(new Event('storage'))
                    router.push(redirectUrl)
                } else {
                    setError('Resposta inválida do servidor')
                }
            } else {
                setError(response.data?.error || 'Credenciais inválidas')
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                setError('Email ou senha incorretos')
            } else if (error.response?.data?.error) {
                setError(error.response.data.error)
            } else {
                setError('Erro de conexão com o servidor')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Background Propriedades="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md bg-zinc-800 border-zinc-700 text-white">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-red-600 rounded-full">
                            <Film className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Cinema Digital</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Faça login para acessar o sistema
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert className="bg-red-900 border-red-700 text-red-200">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="seu@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Senha
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10 pr-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 mr-2">⏳</div>
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <Separator className="my-6 bg-zinc-600" />

                    <div className="text-center">
                        <p className="text-sm text-zinc-400 mb-3">
                            Ainda não tem uma conta?
                        </p>
                        <Link href={`/cadastro${redirectUrl !== '/' ? `?redirect=${redirectUrl}` : ''}`}>
                            <Button
                                variant="outline"
                                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Criar conta
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Background>
    )
}