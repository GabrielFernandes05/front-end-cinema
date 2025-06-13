'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessaoService, IngressoService } from '@/utils/axios'
import Background from '@/components/background'
import Img from '@/components/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Film, Calendar, Clock, Star, MapPin, DollarSign, User, CheckCircle, LogIn } from 'lucide-react'

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

const SeatButton = ({
  seat,
  isAvailable,
  isSelected,
  onToggle
}: {
  seat: string
  isAvailable: boolean
  isSelected: boolean
  onToggle: () => void
}) => (
  <Button
    onClick={onToggle}
    disabled={!isAvailable}
    size="sm"
    className={cn(
      "w-10 h-10 text-xs font-medium transition-all duration-200",
      {
        "bg-zinc-600 text-zinc-400 cursor-not-allowed hover:bg-zinc-600": !isAvailable,
        "bg-red-600 hover:bg-red-700 text-white": isSelected,
        "bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-500": isAvailable && !isSelected
      }
    )}
  >
    {seat}
  </Button>
)

const MovieInfo = ({ sessao }: { sessao: Sessao }) => (
  <Card className="bg-zinc-800 border-zinc-700 text-white mb-8">
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-shrink-0">
        <Img
          src={sessao.filme.caminhoPoster}
          className="w-full md:w-48 h-72 object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="flex-1 space-y-4">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{new Date(sessao.filme.anoLancamento).getFullYear()}</Badge>
            <Badge variant="destructive" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {sessao.filme.nota}
            </Badge>
          </div>
          <CardTitle className="text-3xl text-white mb-2">{sessao.filme.titulo}</CardTitle>
          <CardDescription className="text-zinc-300 text-base leading-relaxed">
            {sessao.filme.sinopse}
          </CardDescription>
        </CardHeader>

        <Separator className="bg-zinc-600" />

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Film className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Diretor:</span>
                <span className="text-white">{sessao.filme.diretor}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Duração:</span>
                <span className="text-white">{sessao.filme.duracao} min</span>
              </p>
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Classificação:</span>
                <span className="text-white">{sessao.filme.classificacao} anos</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Sala:</span>
                <span className="text-white">{sessao.sala.nome}</span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Data:</span>
                <span className="text-white">{new Date(sessao.data).toLocaleString('pt-BR')}</span>
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400">Preço:</span>
                <span className="text-red-400 font-semibold">R$ {sessao.precoIngresso.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  </Card>
)

const SeatSelection = ({
  sessao,
  selectedSeats,
  onSeatToggle,
  poltronasDisponiveis
}: {
  sessao: Sessao
  selectedSeats: string[]
  onSeatToggle: (seat: string) => void
  poltronasDisponiveis: string[]
}) => {
  const rows = Array.from({ length: sessao.sala.fileiras.charCodeAt(0) - 64 }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  return (
    <Card className="bg-zinc-800 border-zinc-700 text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-xl mb-4">Selecione suas poltronas</CardTitle>
        <div className="flex justify-center mb-6">
          <div className="bg-white text-black px-8 py-2 rounded font-bold shadow-lg">
            TELA
          </div>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-700 border border-zinc-500 rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Selecionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-600 rounded"></div>
            <span>Ocupada</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 items-center">
          {rows.map(row => (
            <div key={row} className="flex gap-2 items-center">
              <span className="w-6 text-center text-zinc-400 text-sm font-medium">{row}</span>
              {Array.from({ length: sessao.sala.poltronas }, (_, i) => {
                const seat = `${row}${i + 1}`
                const isAvailable = poltronasDisponiveis.includes(seat)
                const isSelected = selectedSeats.includes(seat)

                return (
                  <SeatButton
                    key={seat}
                    seat={`${i + 1}`}
                    isAvailable={isAvailable}
                    isSelected={isSelected}
                    onToggle={() => isAvailable && onSeatToggle(seat)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const LoadingState = () => (
  <Background Propriedades="flex items-center justify-center min-h-screen">
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-8 text-center">
        <div className="animate-spin text-4xl mb-4">🎬</div>
        <p className="text-white">Carregando sessão...</p>
      </CardContent>
    </Card>
  </Background>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Background Propriedades="flex items-center justify-center min-h-screen">
    <Card className="bg-zinc-800 border-zinc-700">
      <CardContent className="p-8 text-center">
        <div className="text-4xl mb-4">❌</div>
        <p className="text-white">Problemas ao carregar esta sessão</p>
        <Button onClick={onRetry} className="mt-4 bg-red-600 hover:bg-red-700">
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  </Background>
)

const LoginRequired = ({ onLogin }: { onLogin: () => void }) => (
  <Card className="mt-8 bg-zinc-800 border-zinc-700 text-white">
    <CardContent className="p-6 text-center">
      <LogIn className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-xl font-semibold mb-2">Login necessário</h3>
      <p className="text-zinc-400 mb-4">
        Você precisa estar logado para comprar ingressos
      </p>
      <Button onClick={onLogin} className="bg-red-600 hover:bg-red-700">
        Fazer Login
      </Button>
    </CardContent>
  </Card>
)

export default function CompraIngresso() {
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [poltronasDisponiveis, setPoltronasDisponiveis] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const params = useParams()
  const router = useRouter()
  const sessaoService = new SessaoService()
  const ingressoService = new IngressoService()

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }

  const fetchSessao = async () => {
    try {
      const sessaoResponse = await sessaoService.getSessaoById(params.id as string)

      let sessaoData = null
      if (sessaoResponse.data.data) {
        sessaoData = sessaoResponse.data.data
      } else if (sessaoResponse.data) {
        sessaoData = sessaoResponse.data
      }

      setSessao(sessaoData)

      if (sessaoData) {
        try {
          const poltronasResponse = await ingressoService.getPoltronasDisponiveis(params.id as string)

          if (poltronasResponse.data.data) {
            setPoltronasDisponiveis(poltronasResponse.data.data)
          } else if (Array.isArray(poltronasResponse.data)) {
            setPoltronasDisponiveis(poltronasResponse.data)
          } else {
            const totalSeats = []
            const rows = Array.from({ length: sessaoData.sala.fileiras.charCodeAt(0) - 64 }, (_, i) =>
              String.fromCharCode(65 + i)
            )
            for (const row of rows) {
              for (let i = 1; i <= sessaoData.sala.poltronas; i++) {
                totalSeats.push(`${row}${i}`)
              }
            }
            setPoltronasDisponiveis(totalSeats)
          }
        } catch (poltronasError) {
          const totalSeats = []
          const rows = Array.from({ length: sessaoData.sala.fileiras.charCodeAt(0) - 64 }, (_, i) =>
            String.fromCharCode(65 + i)
          )
          for (const row of rows) {
            for (let i = 1; i <= sessaoData.sala.poltronas; i++) {
              totalSeats.push(`${row}${i}`)
            }
          }
          setPoltronasDisponiveis(totalSeats)
        }
      }

    } catch (error) {
      setSessao(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleSeat = (seat: string) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    )
  }

  const handleLogin = () => {
    router.push(`/login?redirect=/sessao/${params.id}`)
  }

  const handlePurchase = async () => {
    if (!sessao || selectedSeats.length === 0 || !isLoggedIn) return

    setPurchasing(true)
    try {
      const response = await ingressoService.ComprarIngressos(sessao.id, selectedSeats)

      if (response.status === 201 || response.status === 200) {
        router.push('/perfil?tab=tickets')
      } else {
        alert(response.data.error || "Erro ao finalizar a compra.")
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        alert("Sessão expirada. Faça login novamente.")
      } else {
        alert(error.response?.data?.error || "Erro de conexão com o servidor.")
      }
    } finally {
      setPurchasing(false)
    }
  }

  const handleRetry = () => {
    setLoading(true)
    fetchSessao()
  }

  useEffect(() => {
    checkAuthStatus()
    fetchSessao()

    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [params.id])

  if (loading) return <LoadingState />
  if (!sessao) return <ErrorState onRetry={handleRetry} />

  const totalPrice = selectedSeats.length * sessao.precoIngresso

  return (
    <Background Propriedades="p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Comprar Ingressos</h1>
          <p className="text-zinc-400">Selecione suas poltronas preferidas</p>
        </div>

        <MovieInfo sessao={sessao} />

        <SeatSelection
          sessao={sessao}
          selectedSeats={selectedSeats}
          onSeatToggle={toggleSeat}
          poltronasDisponiveis={poltronasDisponiveis}
        />

        {!isLoggedIn ? (
          <LoginRequired onLogin={handleLogin} />
        ) : selectedSeats.length > 0 ? (
          <Card className="mt-8 bg-zinc-800 border-zinc-700 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-zinc-300">
                    <strong>Poltronas selecionadas:</strong> {selectedSeats.join(', ')}
                  </p>
                  <p className="text-xl font-bold text-red-400">
                    Total: R$ {totalPrice.toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2">⏳</div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmar Compra
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Background>
  )
}
