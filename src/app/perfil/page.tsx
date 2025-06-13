'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axiosInstance, { IngressoService } from '@/utils/axios'
import Background from '@/components/background'
import Img from '@/components/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { User, Calendar, Mail, LogOut, Loader2, Ticket, Film, MapPin, Clock, DollarSign } from 'lucide-react'

interface Usuario {
  id: string
  name: string
  email: string
  dataNascimento: string
}

interface Filme {
  id: string
  titulo: string
  sinopse: string
  diretor: string
  duracao: number
  anoLancamento: string
  classificacao: number
  nota: number
  caminhoPoster: string
}

interface Sala {
  id: string
  nome: string
  fileiras: string
  poltronas: number
}

interface Sessao {
  id: string
  filme: Filme
  sala: Sala
  dataInicio: string
  dataFim: string
  data: string
  precoIngresso: number
}

interface Ingresso {
  id: string
  poltrona: string
  dataCompra: string
  preco: number
  sessao: Sessao
  status: string
}

const formatPrice = (price: number) => `R$ ${price.toFixed(2)}`

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const IngressoCard = ({ ingresso }: { ingresso: Ingresso }) => {
  const isExpired = new Date(ingresso.sessao.dataFim) < new Date()

  return (
    <Card className="bg-zinc-800 border-zinc-700 text-white">
      <div className="flex">
        <div className="w-24 flex-shrink-0">
          <Img
            src={ingresso.sessao.filme.caminhoPoster}
            className="w-full h-32 object-cover rounded-l-lg"
          />
        </div>
        <div className="flex flex-col flex-1 p-4">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg text-white line-clamp-1">
                {ingresso.sessao.filme.titulo}
              </CardTitle>
              <Badge
                variant={isExpired ? "secondary" : "destructive"}
                className={isExpired ? "bg-zinc-600 text-zinc-300" : "bg-red-600 text-white"}
              >
                {isExpired ? "Exibido" : "Válido"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1 text-zinc-300">
                <MapPin className="w-3 h-3" />
                <span>Sala {ingresso.sessao.sala.nome}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Ticket className="w-3 h-3" />
                <span>Poltrona {ingresso.poltrona}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-300">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(ingresso.sessao.data)}</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <DollarSign className="w-3 h-3" />
                <span>{formatPrice(ingresso.preco)}</span>
              </div>
            </div>

            <div className="text-xs text-zinc-400 pt-1">
              Comprado em: {formatDate(ingresso.dataCompra)}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

const UserInfoTab = ({ usuario }: { usuario: Usuario }) => (
  <div className="space-y-6">
    <Card className="bg-zinc-800 border-zinc-700 text-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">{usuario.name}</CardTitle>
        <CardDescription className="text-zinc-400">
          Membro do Cinema Digital
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg">
            <Mail className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="text-white font-medium">{usuario.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="text-sm text-zinc-400">Data de Nascimento</p>
              <p className="text-white font-medium">
                {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg">
          <User className="w-5 h-5 text-zinc-400" />
          <div>
            <p className="text-sm text-zinc-400">ID do Usuário</p>
            <p className="text-white font-medium text-xs">{usuario.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const IngressosTab = ({ ingressos, loading }: { ingressos: Ingresso[], loading: boolean }) => {
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="ml-2 text-white">Carregando ingressos...</span>
      </div>
    )
  }

  if (ingressos.length === 0) {
    return (
      <Card className="bg-zinc-800 border-zinc-700 text-white">
        <CardContent className="p-12 text-center">
          <Ticket className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
          <h3 className="text-xl font-semibold mb-2">Nenhum ingresso encontrado</h3>
          <p className="text-zinc-400 mb-6">
            Você ainda não comprou nenhum ingresso. Que tal conferir os filmes em cartaz?
          </p>
          <Button
            onClick={() => router.push('/em-cartaz')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Ver Filmes em Cartaz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ingressosValidos = ingressos.filter(i => new Date(i.sessao.dataFim) >= new Date())
  const ingressosExpirados = ingressos.filter(i => new Date(i.sessao.dataFim) < new Date())

  return (
    <div className="space-y-6">
      {ingressosValidos.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-500" />
            Ingressos Válidos ({ingressosValidos.length})
          </h3>
          <div className="grid gap-4">
            {ingressosValidos.map(ingresso => (
              <IngressoCard key={ingresso.id} ingresso={ingresso} />
            ))}
          </div>
        </div>
      )}

      {ingressosExpirados.length > 0 && (
        <div>
          <Separator className="bg-zinc-600 my-6" />
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" />
            Histórico ({ingressosExpirados.length})
          </h3>
          <div className="grid gap-4">
            {ingressosExpirados.map(ingresso => (
              <IngressoCard key={ingresso.id} ingresso={ingresso} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [ingressos, setIngressos] = useState<Ingresso[]>([])
  const [loading, setLoading] = useState(true)
  const [ingressosLoading, setIngressosLoading] = useState(true)
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'
  const ingressoService = new IngressoService()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/login')
        return
      }

      try {
        const [usuarioResponse, ingressosResponse] = await Promise.all([
          axiosInstance.get('/api/v1/usuarios/logado'),
          ingressoService.getMeusIngressos().catch(() => ({ data: [] }))
        ])

        if (usuarioResponse.data.data) {
          setUsuario(usuarioResponse.data.data)
        } else if (usuarioResponse.data) {
          setUsuario(usuarioResponse.data)
        }

        if (ingressosResponse.data) {
          if (Array.isArray(ingressosResponse.data)) {
            setIngressos(ingressosResponse.data)
          } else if (ingressosResponse.data.data && Array.isArray(ingressosResponse.data.data)) {
            setIngressos(ingressosResponse.data.data)
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
        } else {
          setError('Erro ao carregar dados do usuário')
        }
      } finally {
        setLoading(false)
        setIngressosLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('storage'))
    router.push('/')
  }

  if (loading) {
    return (
      <Background Propriedades="flex items-center justify-center min-h-screen">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white">Carregando perfil...</p>
          </CardContent>
        </Card>
      </Background>
    )
  }

  if (error) {
    return (
      <Background Propriedades="flex items-center justify-center min-h-screen">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-white mb-4">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </Background>
    )
  }

  if (!usuario) {
    return (
      <Background Propriedades="flex items-center justify-center min-h-screen">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-8 text-center">
            <p className="text-white">Usuário não encontrado</p>
          </CardContent>
        </Card>
      </Background>
    )
  }

  return (
    <Background Propriedades="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <User className="w-10 h-10 text-red-500" />
            Meu Perfil
          </h1>
          <p className="text-zinc-400">Gerencie sua conta e veja seus ingressos</p>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border-zinc-700">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-zinc-400"
              onClick={() => router.push('/perfil?tab=profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-zinc-400"
              onClick={() => router.push('/perfil?tab=tickets')}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Meus Ingressos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UserInfoTab usuario={usuario} />
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <IngressosTab ingressos={ingressos} loading={ingressosLoading} />
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-zinc-800 border-zinc-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/em-cartaz')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Film className="w-4 h-4 mr-2" />
                Ver Filmes em Cartaz
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Background>
  )
}
