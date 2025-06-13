'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UsuarioService } from '@/utils/axios'
import Background from '@/components/background'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { User, Calendar, Mail, LogOut, Loader2, Ticket, MapPin, Clock, DollarSign, Film } from 'lucide-react'
import Link from 'next/link'

interface Permissao {
  id: string
  nome: string
  descricao: string
}

interface Ingresso {
  id: string
  filme: string
  sala: string
  poltrona: string
  compradoEm: string
}

interface Usuario {
  id: string
  primeiroNome: string
  ultimoNome: string
  cpf: string
  email: string
  dataNascimento: string
  permissoes: Permissao[]
  ingressos: Ingresso[]
  createdAt: string
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  } catch {
    return dateString
  }
}

const usuarioService = new UsuarioService()

const IngressoCard = ({ ingresso }: { ingresso: Ingresso }) => (
  <Card className="bg-zinc-700 border-zinc-600 text-white">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold">{ingresso.filme}</h3>
        </div>
        <Badge className="bg-green-600 text-white">
          Ativo
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-zinc-400" />
          <span><strong>Sala:</strong> {ingresso.sala}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-zinc-400" />
          <span><strong>Poltrona:</strong> {ingresso.poltrona}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-300 mt-3">
        <Clock className="w-4 h-4 text-zinc-400" />
        <span><strong>Comprado em:</strong> {formatDateTime(ingresso.compradoEm)}</span>
      </div>
    </CardContent>
  </Card>
)

const InfoCard = ({
  icon,
  label,
  value,
  valueClassName = ""
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClassName?: string
}) => (
  <div className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg">
    {icon}
    <div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`text-white font-medium ${valueClassName}`}>{value}</p>
    </div>
  </div>
)

const UserInfoTab = ({ usuario }: { usuario: Usuario }) => (
  <div className="space-y-6">
    <Card className="bg-zinc-800 border-zinc-700 text-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {usuario.primeiroNome} {usuario.ultimoNome}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Membro do Cinema Digital
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<Mail className="w-5 h-5 text-zinc-400" />}
            label="Email"
            value={usuario.email}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5 text-zinc-400" />}
            label="Data de Nascimento"
            value={formatDate(usuario.dataNascimento)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<User className="w-5 h-5 text-zinc-400" />}
            label="CPF"
            value={usuario.cpf}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5 text-zinc-400" />}
            label="Membro desde"
            value={formatDate(usuario.createdAt)}
          />
        </div>

        <InfoCard
          icon={<User className="w-5 h-5 text-zinc-400" />}
          label="ID do Usuário"
          value={usuario.id}
          valueClassName="text-xs"
        />
      </CardContent>
    </Card>
  </div>
)

const LoadingState = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-white" />
    <span className="ml-2 text-white">{message}</span>
  </div>
)

const EmptyIngressosState = () => (
  <Card className="bg-zinc-800 border-zinc-700 text-white">
    <CardContent className="p-12 text-center">
      <Ticket className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
      <h3 className="text-xl font-semibold mb-2">Nenhum ingresso encontrado</h3>
      <p className="text-zinc-400 mb-6">
        Você ainda não comprou nenhum ingresso. Que tal conferir os filmes em cartaz?
      </p>
      <Link href="/em-cartaz">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Ver Filmes em Cartaz
        </Button>
      </Link>
    </CardContent>
  </Card>
)

const IngressosTab = ({ ingressos }: { ingressos: Ingresso[] }) => {
  if (!ingressos || ingressos.length === 0) {
    return <EmptyIngressosState />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          🎟️ Meus Ingressos ({ingressos.length})
        </h2>
        <div className="space-y-4">
          {ingressos.map(ingresso => (
            <IngressoCard key={ingresso.id} ingresso={ingresso} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <Background>
    <div className="min-h-screen flex justify-center items-center">
      <Card className="bg-zinc-800 border-zinc-700 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2 text-red-400">{message}</h3>
          <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    </div>
  </Background>
)

export default function PerfilPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeTab = searchParams.get('tab') || 'profile'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`/perfil?${params.toString()}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('storage'))
    router.push('/')
  }

  const handleRetryLoad = () => {
    setError(null)
    setLoading(true)
    loadUserData()
  }

  const loadUserData = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await usuarioService.getUsuarioLogado()
      const userData = response.data.data || response.data
      setUsuario(userData)
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      } else {
        setError('Erro ao carregar dados do usuário')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  if (loading) {
    return (
      <Background>
        <div className="min-h-screen flex justify-center items-center">
          <LoadingState message="Carregando..." />
        </div>
      </Background>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetryLoad} />
  }

  if (!usuario) {
    return (
      <Background>
        <div className="min-h-screen flex justify-center items-center">
          <Card className="bg-zinc-800 border-zinc-700 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Usuário não encontrado</h3>
              <Button onClick={() => router.push('/login')} className="bg-red-600 hover:bg-red-700">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Background>
    )
  }

  return (
    <Background>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border-zinc-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-red-600">
                Informações Pessoais
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-red-600">
                Meus Ingressos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <UserInfoTab usuario={usuario} />
            </TabsContent>

            <TabsContent value="tickets" className="mt-6">
              <IngressosTab ingressos={usuario.ingressos} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Background>
  )
}

