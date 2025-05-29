'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SessaoService, IngressoService } from "@/utils/axios"
import Cookies from 'js-cookie'
import Background from "@/components/background"
import Img from "@/components/image"

const sessaoService = new SessaoService()
const ingressoService = new IngressoService()

export default function CompraIngresso() {
  const { id } = useParams()
  const [sessao, setSessao] = useState<any>(null)
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      const urlSessao = `/sessao/${id}`;
      router.push(`/login?redirect=${encodeURIComponent(urlSessao)}`);
    }
  }, [])

  useEffect(() => {
    const fetchSessao = async () => {
      try {
        const response = await sessaoService.getSessaoById(id as string);
        setSessao(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar sessão:', error);
      };
    };

    if (id) fetchSessao();
  }, [id]);

  const togglePoltrona = (poltrona: string) => {
    if (selecionadas.includes(poltrona)) {
      setSelecionadas(selecionadas.filter(p => p !== poltrona));
    } else {
      setSelecionadas([...selecionadas, poltrona]);
    };
  };

  if (!sessao) return <p>Problemas ao carregar esta sessão</p>

  const fileiras = Array.from({ length: sessao.sala.fileiras.charCodeAt(0) - 64 }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  const confirmarCompra = async () => {
    try {
      const response = await ingressoService.ComprarIngressos(sessao.id, selecionadas)
  
      if (response.status === 201) {
        window.location.href = "/"
      } else {
        alert(response.data.error || "Erro ao finalizar a compra.")
      }
    } catch (error) {
      console.error("Erro ao comprar ingresso:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  return (
    <Background Propriedades="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Comprar Ingressos</h1>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-700 p-6 rounded-2xl shadow-lg mb-8 text-white flex flex-row gap-6">
          <Img src={sessao.filme.caminhoPoster} className="w-40 h-60 object-cover rounded-xl shadow-lg" />

          <div className="flex flex-col justify-between flex-1 space-y-2">
            <div>
              <h2 className="text-3xl font-bold">{sessao.filme.titulo}</h2>
              <p className="text-sm italic text-gray-400">{new Date(sessao.filme.anoLancamento).getFullYear()}</p>
              <p className="text-base mt-2">{sessao.filme.sinopse}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <p><span className="font-semibold text-gray-300">🎬 Diretor:</span> {sessao.filme.diretor}</p>
              <p><span className="font-semibold text-gray-300">🕒 Duração:</span> {sessao.filme.duracao} min</p>
              <p><span className="font-semibold text-gray-300">🔞 Classificação:</span> {sessao.filme.classificacao} anos</p>
              <p><span className="font-semibold text-gray-300">⭐ Nota:</span> {sessao.filme.nota}</p>
              <p><span className="font-semibold text-gray-300">🏠 Sala:</span> {sessao.sala.nome}</p>
              <p><span className="font-semibold text-gray-300">💵 Preço:</span> R$ {sessao.precoIngresso.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Selecione suas poltronas:</h3>
          <div className="flex justify-center mb-6">
            <span className="bg-white text-black px-8 py-2 shadow font-bold">TELA</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            {fileiras.map(fileira => (
              <div key={fileira} className="flex gap-2 items-center">
                {Array.from({ length: sessao.sala.poltronas }, (_, i) => {
                  const poltrona = `${fileira}${i + 1}`
                  const disponivel = sessao.poltronasDisponiveis.includes(poltrona)
                  const selecionada = selecionadas.includes(poltrona)
                  return (
                    <button
                      key={poltrona}
                      onClick={() => disponivel && togglePoltrona(poltrona)}
                      className={`
                        w-10 h-10 rounded 
                        ${!disponivel ? 'bg-gray-600 cursor-not-allowed' : 
                        selecionada ? 'bg-green-500' : 'bg-blue-500'} 
                        text-white text-sm
                      `}
                    >
                      {fileira}{i + 1}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {selecionadas.length > 0 && (
          <div className="mt-6 text-center">
            <p className="mb-2"><strong>Poltronas selecionadas:</strong> {selecionadas.join(', ')}</p>
            <button className="bg-green-600 text-white py-2 px-6 rounded shadow hover:bg-green-700 transition" onClick={confirmarCompra}>
              Confirmar Compra
            </button>
          </div>
        )}
      </div>
    </Background>
  )
}
