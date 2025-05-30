'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/utils/axios'
import Background from '@/components/background'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Film, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface LoginForm {
    email: string
    password: string
}

export default function Login() {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
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
            console.log('Tentando fazer login com:', { email: form.email, password: '***' })

            const response = await login(form.email, form.password)

            console.log('Resposta completa do login:', response)
            console.log('Status:', response.status)
            console.log('Data:', response.data)

            if (response.status === 200 && response.data) {
                const token = response.data.data || response.data

                console.log('Token extraído:', token)

                if (token && typeof token === 'string') {
                    localStorage.setItem('token', token)
                    console.log('Token salvo no localStorage:', token)

                    // Disparar evento para atualizar outros componentes
                    window.dispatchEvent(new Event('storage'))

                    // Redirecionar para a página inicial
                    router.push('/')

                    // Opcional: forçar refresh para garantir que tudo atualize
                    setTimeout(() => {
                        window.location.reload()
                    }, 100)
                } else {
                    console.log('Token não encontrado ou formato inválido')
                    setError('Resposta inválida do servidor')
                }
            } else {
                console.log('Login falhou - status ou data inválidos')
                setError(response.data?.error || 'Credenciais inválidas')
            }
        } catch (error: any) {
            console.error('Erro completo no login:', error)
            console.error('Response error:', error.response)

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
                                    type="password"
                                    placeholder="Sua senha"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-950 border border-red-800 rounded-md">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-red-400">{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <Separator className="my-6 bg-zinc-600" />

                    <div className="text-center">
                        <p className="text-sm text-zinc-400">
                            Não tem uma conta?{' '}
                            <Link
                                href="/cadastro"
                                className="text-red-400 hover:text-red-300 font-medium hover:underline"
                            >
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Background>
    )
}