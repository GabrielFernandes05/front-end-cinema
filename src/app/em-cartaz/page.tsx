'use client'

import { useEffect, useState } from 'react'
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
    <Background Propriedades="flex flex-col items-center justify-start p-4 gap-4">
      <h1 className="text-2xl font-bold mb-4">Filmes em Cartaz</h1>

      {sessoes.map(sessao => (
        <div key={sessao.id} className="bg-zinc-900 rounded-xl p-4 shadow w-full max-w-xl">
          <h2 className="text-xl font-semibold">{sessao.filme.titulo}</h2>
          <p><strong>Duração:</strong> {sessao.filme.duracao} min</p>
          <p><strong>Classificação:</strong> {sessao.filme.classificacao} anos</p>
          <p><strong>Preço:</strong> R$ {sessao.precoIngresso.toFixed(2)}</p>
        </div>
      ))}
    </Background>
  )
}
