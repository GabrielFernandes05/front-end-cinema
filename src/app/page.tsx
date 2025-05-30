import Background from "@/components/background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, Popcorn, Ticket } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <Background Propriedades="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full space-y-8">
        <Card className="bg-zinc-800 border-zinc-700 text-white text-center">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-red-600 rounded-full">
                <Film className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-red-500">
              Cinema Digital
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Bem-vindo ao nosso sistema de cinema! Explore filmes em cartaz e reserve seus ingressos.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-zinc-700 border-zinc-600">
                <CardContent className="p-6 text-center space-y-3">
                  <Popcorn className="w-8 h-8 text-red-400 mx-auto" />
                  <h3 className="font-semibold text-white">Filmes em Cartaz</h3>
                  <p className="text-sm text-zinc-300">
                    Confira os lançamentos e escolha seu filme favorito
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-700 border-zinc-600">
                <CardContent className="p-6 text-center space-y-3">
                  <Ticket className="w-8 h-8 text-red-400 mx-auto" />
                  <h3 className="font-semibold text-white">Reserve Online</h3>
                  <p className="text-sm text-zinc-300">
                    Escolha seus assentos e compre ingressos facilmente
                  </p>
                </CardContent>
              </Card>
            </div>

            <Link href="/em-cartaz">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                Ver Filmes em Cartaz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Background>
  )
}