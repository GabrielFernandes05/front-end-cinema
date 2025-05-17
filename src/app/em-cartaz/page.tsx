'use client'

import { useEffect, useState } from 'react'
import { FilmeService } from '@/utils/axios'

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

export default function EmCartaz() {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const filmeService = new FilmeService()

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await filmeService.getFilmesEmCartaz()
        setFilmes(response.data.data)
      } catch (error) {
        console.error('Erro ao buscar filmes em cartaz:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilmes()
  }, [])

  if (loading) return <p className="text-center mt-10">Carregando filmes...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filmes em Cartaz</h1>

      {filmes.length === 0 && <p>Nenhum filme em cartaz.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filmes.map((filme) => (
          <div
            key={filme.id}
            className="bg-zinc-800 text-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold">{filme.titulo}</h2>
            <p className="text-sm text-zinc-400 mt-1">{filme.diretor} • {new Date(filme.anoLancamento).getFullYear()}</p>
            <p className="mt-2">{filme.sinopse}</p>
            <p className="mt-2 text-sm text-zinc-500">
              Duração: {filme.duracao} min • Classificação: {filme.classificacao}+
            </p>
            <p className="mt-1 text-yellow-400">Nota: {filme.nota}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
