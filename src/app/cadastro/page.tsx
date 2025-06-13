'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cadastrarUsuario } from '@/utils/axios'
import Background from '@/components/background'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Film, User, Mail, Lock, Calendar, AlertCircle, Loader2, CheckCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface CadastroForm {
  name: string
  cpf: string
  email: string
  password: string
  dataNascimento: string
}

export default function Cadastro() {
  const [form, setForm] = useState<CadastroForm>({
    name: '',
    cpf: '',
    email: '',
    password: '',
    dataNascimento: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setForm(prev => ({
      ...prev,
      cpf: formatted
    }))
    if (error) setError('')
  }

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '')
    if (numbers.length !== 11) return false

    if (/^(\d)\1{10}$/.test(numbers)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === parseInt(numbers[10])
  }

  const validateForm = () => {
    if (!form.name.trim()) return 'Nome é obrigatório'
    if (!form.cpf.trim()) return 'CPF é obrigatório'
    if (!validateCPF(form.cpf)) return 'CPF inválido'
    if (!form.email.trim()) return 'Email é obrigatório'
    if (!form.password.trim()) return 'Senha é obrigatória'
    if (form.password.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (!form.dataNascimento) return 'Data de nascimento é obrigatória'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) return 'Email inválido'

    const birthDate = new Date(form.dataNascimento)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 13) return 'Você deve ter pelo menos 13 anos'

    return null
  }

  const formatDateForAPI = (dateString: string) => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString + 'T00:00:00.000Z')
      return date.toISOString()
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return dateString + 'T00:00:00.000Z'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = {
        ...form,
        cpf: form.cpf.replace(/\D/g, ''),
        dataNascimento: formatDateForAPI(form.dataNascimento)
      }

      console.log('Dados enviados:', formData)

      await cadastrarUsuario(formData)

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      console.error('Erro no cadastro:', error)

      if (error.response?.status === 409) {
        setError('Email ou CPF já está em uso')
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.error || error.response?.data?.message
        if (errorMsg?.includes('parsing time')) {
          setError('Formato de data inválido. Tente novamente.')
        } else if (errorMsg?.includes('cpf')) {
          setError('CPF inválido ou já cadastrado.')
        } else if (errorMsg?.includes('email')) {
          setError('Email inválido ou já cadastrado.')
        } else {
          setError(errorMsg || 'Dados inválidos. Verifique os campos.')
        }
      } else if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Erro de conexão com o servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Background Propriedades="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-zinc-800 border-zinc-700 text-white">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-600 rounded-full">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">Cadastro realizado!</CardTitle>
            <p className="text-zinc-400">
              Você será redirecionado para o login...
            </p>
          </CardContent>
        </Card>
      </Background>
    )
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
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription className="text-zinc-400">
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleCPFChange}
                  disabled={loading}
                  maxLength={14}
                  className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
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
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento" className="text-sm font-medium">
                Data de nascimento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]}
                  className="pl-10 bg-zinc-700 border-zinc-600 text-white focus:border-red-500"
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
                  Cadastrando...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          <Separator className="my-6 bg-zinc-600" />

          <div className="text-center">
            <p className="text-sm text-zinc-400">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="text-red-400 hover:text-red-300 font-medium hover:underline"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </Background>
  )
}
