'use client'

import { useEffect, useState } from 'react'
import Background from '@/components/background'
import { UsuarioService } from "@/utils/axios";

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

const usuarioService = new UsuarioService()

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    usuarioService.getUsuarioLogado()
    .then(response => setUsuario(response.data.data))
    .catch(error => console.error('Erro ao buscar perfil:', error))
  }, [])

  if (!usuario) {
    return <p className="text-white text-center mt-6">Carregando perfil...</p>
  }

  return (
    <Background Propriedades="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">👤 Meu Perfil</h1>

      <div className="bg-zinc-800 rounded-2xl p-6 text-white mb-6 shadow">
        <p><strong>Nome:</strong> {usuario.primeiroNome} {usuario.ultimoNome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>CPF:</strong> {usuario.cpf}</p>
        <p><strong>Data de Nascimento:</strong> {new Date(usuario.dataNascimento).toLocaleDateString()}</p>
        <p><strong>Criado em:</strong> {new Date(usuario.createdAt).toLocaleDateString()}</p>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-2">🎟️ Ingressos Comprados</h2>
      {usuario.ingressos.length === 0 ? (
        <p className="text-gray-300">Nenhum ingresso comprado.</p>
      ) : (
        <ul className="space-y-4">
          {usuario.ingressos.map(ingresso => (
            <li key={ingresso.id} className="bg-zinc-700 rounded-xl p-4 text-white shadow">
              <p><strong>Filme:</strong> {ingresso.filme}</p>
              <p><strong>Sala:</strong> {ingresso.sala}</p>
              <p><strong>Poltrona:</strong> {ingresso.poltrona}</p>
              <p><strong>Comprado em:</strong> {new Date(ingresso.compradoEm).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </Background>
  )
}
