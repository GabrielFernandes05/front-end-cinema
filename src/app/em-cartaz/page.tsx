'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SessaoService } from '@/utils/axios'
import Background from '@/components/background'
import Img from '@/components/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Film, Calendar, Clock, Star, MapPin, DollarSign, RefreshCw } from 'lucide-react'

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
  disponibilidade: number
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

const MovieCard = ({ sessao, onBuyTickets }: {
  sessao: Sessao,
  onBuyTickets: (id: string) => void
}) => (
  <Card className="bg-zinc-800 border-zinc-700 text-white hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className="flex">
      <div className="w-32 flex-shrink-0">
        <Img
          src={sessao.filme.caminhoPoster}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white line-clamp-2">
            {sessao.filme.titulo}
          </CardTitle>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {sessao.filme.duracao} min
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {sessao.filme.classificacao} anos
            </Badge>
            <Badge variant="destructive" className="text-xs flex items-center gap-1">
              <Star className="w-3 h-3" />
              {sessao.filme.nota}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1 text-sm text-zinc-300 mb-3">
            <p className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatPrice(sessao.precoIngresso)}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(sessao.data)}
            </p>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Sala: {sessao.sala.nome}
            </p>
          </div>
          <Button
            onClick={() => onBuyTickets(sessao.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            <Film className="w-4 h-4 mr-2" />
            Comprar Ingressos
          </Button>
        </CardContent>
      </div>
    </div>
  </Card>
)

const LoadingState = () => (
  <Background Propriedades="flex items-center justify-center min-h-screen">
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-8 text-center">
        <div className="animate-spin text-4xl mb-4">🎬</div>
        <p className="text-white">Carregando filmes...</p>
        <p className="text-zinc-400 text-sm mt-2">Aguarde um momento</p>
      </CardContent>
    </Card>
  </Background>
)

const ErrorState = ({ onRetry, errorMessage }: {
  onRetry: () => void,
  errorMessage?: string
}) => (
  <Background Propriedades="flex items-center justify-center min-h-screen">
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-8 text-center space-y-4">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-white">Serviço temporariamente indisponível</p>
        <p className="text-zinc-400 text-sm">
          {errorMessage || 'Tente novamente em alguns instantes'}
        </p>
        <Button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  </Background>
)

const EmptyState = () => (
  <Background Propriedades="flex items-center justify-center min-h-screen">
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-8 text-center">
        <div className="text-4xl mb-4">🎭</div>
        <p className="text-white mb-2">Nenhum filme em cartaz</p>
        <p className="text-zinc-400 text-sm">Volte mais tarde para conferir as próximas sessões</p>
      </CardContent>
    </Card>
  </Background>
)

export default function EmCartaz() {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const sessaoService = new SessaoService()
  const router = useRouter()

  const fetchSessoes = async () => {
    setLoading(true)
    setError(false)
    setErrorMessage('')

    try {
      const response = await sessaoService.getSessoesEmCartaz()

      if (response.data) {
        let sessoesList = []

        if (Array.isArray(response.data)) {
          sessoesList = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          sessoesList = response.data.data
        } else if (response.data.sessoes && Array.isArray(response.data.sessoes)) {
          sessoesList = response.data.sessoes
        } else {
          sessoesList = []
        }

        setSessoes(sessoesList)
      } else {
        setSessoes([])
      }
    } catch (error: any) {
      let userMessage = ''

      if (error.response?.status === 404) {
        userMessage = 'Serviço temporariamente indisponível.'
      } else if (error.response?.status === 500) {
        if (error.response?.data?.error?.includes("não encontrada") ||
          error.response?.data?.error?.includes("not found")) {
          setSessoes([])
          setError(false)
          setLoading(false)
          return
        } else {
          userMessage = 'Erro interno do servidor.'
        }
      } else if (error.code === 'ERR_NETWORK') {
        userMessage = 'Verifique sua conexão com a internet.'
      } else if (error.response?.status === 401) {
        userMessage = 'Sessão expirada. Faça login novamente.'
      } else {
        userMessage = 'Não foi possível carregar os filmes no momento.'
      }

      setErrorMessage(userMessage)
      setError(true)
      setSessoes([])
    } finally {
      setLoading(false)
    }
  }

  const handleBuyTickets = (sessaoId: string) => {
    router.push(`/sessao/${sessaoId}`)
  }

  const handleRetry = () => {
    fetchSessoes()
  }

  useEffect(() => {
    fetchSessoes()
  }, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState onRetry={handleRetry} errorMessage={errorMessage} />
  if (sessoes.length === 0) return <EmptyState />

  return (
    <Background Propriedades="flex flex-col items-center justify-start p-6 gap-6 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Film className="w-10 h-10 text-red-500" />
          Filmes em Cartaz
        </h1>
        <p className="text-zinc-400">Escolha seu filme e garanta já seu ingresso!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {sessoes.map(sessao => (
          <MovieCard
            key={sessao.id}
            sessao={sessao}
            onBuyTickets={handleBuyTickets}
          />
        ))}
      </div>
    </Background>
  )
}