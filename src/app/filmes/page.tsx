'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilmeService } from '@/utils/axios'
import Background from '@/components/background'
import Img from '@/components/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Film, Calendar, Clock, Star, User, Search, RefreshCw } from 'lucide-react'

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

const FilmeCard = ({ filme }: { filme: Filme }) => (
    <Card className="bg-zinc-800 border-zinc-700 text-white hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex">
            <div className="w-32 flex-shrink-0">
                <Img
                    src={filme.caminhoPoster}
                    className="w-full h-48 object-cover"
                />
            </div>
            <div className="flex flex-col flex-1 p-0">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white line-clamp-2">
                        {filme.titulo}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {filme.duracao} min
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            <Calendar className="w-3 h-3" />
                            {filme.anoLancamento}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            <User className="w-3 h-3" />
                            {filme.classificacao} anos
                        </Badge>
                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {filme.nota}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                    <p className="text-sm text-zinc-300 line-clamp-3 mb-2">
                        {filme.sinopse}
                    </p>
                    <p className="text-xs text-zinc-400">
                        Diretor: {filme.diretor}
                    </p>
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
                <p className="text-white">Carregando catálogo...</p>
            </CardContent>
        </Card>
    </Background>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <Background Propriedades="flex items-center justify-center min-h-screen">
        <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-8 text-center space-y-4">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-white">Erro ao carregar catálogo</p>
                <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                </Button>
            </CardContent>
        </Card>
    </Background>
)

export default function Filmes() {
    const [filmes, setFilmes] = useState<Filme[]>([])
    const [filteredFilmes, setFilteredFilmes] = useState<Filme[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const filmeService = new FilmeService()

    const fetchFilmes = async () => {
        setLoading(true)
        setError(false)

        try {
            const response = await filmeService.getFilmes()

            let filmesList = []
            if (Array.isArray(response.data)) {
                filmesList = response.data
            } else if (response.data.data && Array.isArray(response.data.data)) {
                filmesList = response.data.data
            }

            setFilmes(filmesList)
            setFilteredFilmes(filmesList)
        } catch (error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        if (!term.trim()) {
            setFilteredFilmes(filmes)
        } else {
            const filtered = filmes.filter(filme =>
                filme.titulo.toLowerCase().includes(term.toLowerCase()) ||
                filme.diretor.toLowerCase().includes(term.toLowerCase())
            )
            setFilteredFilmes(filtered)
        }
    }

    const handleRetry = () => {
        fetchFilmes()
    }

    useEffect(() => {
        fetchFilmes()
    }, [])

    if (loading) return <LoadingState />
    if (error) return <ErrorState onRetry={handleRetry} />

    return (
        <Background Propriedades="flex flex-col items-center justify-start p-6 gap-6 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Film className="w-10 h-10 text-red-500" />
                    Catálogo de Filmes
                </h1>
                <p className="text-zinc-400">Explore nossa coleção completa de filmes</p>
            </div>

            <div className="w-full max-w-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Buscar filmes ou diretores..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-red-500"
                    />
                </div>
            </div>

            {filteredFilmes.length === 0 ? (
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-8 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-white mb-2">Nenhum filme encontrado</p>
                        <p className="text-zinc-400 text-sm">Tente ajustar sua busca</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                    {filteredFilmes.map(filme => (
                        <FilmeCard key={filme.id} filme={filme} />
                    ))}
                </div>
            )}
        </Background>
    )
}