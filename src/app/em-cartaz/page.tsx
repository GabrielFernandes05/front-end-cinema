'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SessaoService } from '@/utils/axios'
import Background from '@/components/background'

interface Filme {
  id: string
  titulo: string
  sinopse: string
  diretor: string
  duracao: number
  anoLancamento: string
  classificacao: number
  nota: number
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
  precoIngresso: number
  disponibilidade: number
}

export default function EmCartaz() {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const sessaoService = new SessaoService()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sessaoService.getSessoesEmCartaz()
        setSessoes(response.data.data)
      } catch (error) {
        console.error('Erro ao buscar sessões em cartaz:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Background Propriedades="flex flex-col items-center justify-start p-6 gap-6">
      <h1 className="text-3xl font-bold text-white mb-4">🎬 Filmes em Cartaz</h1>

      {sessoes.map(sessao => (
        <div
          key={sessao.id}
          className="bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-2xl p-6 w-full max-w-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{sessao.filme.titulo}</h2>

          <div className="text-gray-300 text-sm space-y-1">
            <p><span className="font-semibold">🎞️ Duração:</span> {sessao.filme.duracao} min</p>
            <p><span className="font-semibold">🔞 Classificação:</span> {sessao.filme.classificacao} anos</p>
            <p><span className="font-semibold">💵 Preço:</span> R$ {sessao.precoIngresso.toFixed(2)}</p>
          </div>

          <div className="mt-4">
            <button
              onClick={() => router.push(`/sessao/${sessao.id}`)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Comprar Ingressos!
            </button>
          </div>
        </div>
      ))}
    </Background>
  )
}
