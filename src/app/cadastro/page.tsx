'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cadastrarUsuario } from '@/utils/axios';

export default function CadastroUsuario() {
  const router = useRouter();
  const [form, setForm] = useState({
    primeiroNome: '',
    ultimoNome: '',
    cpf: '',
    email: '',
    password: '',
    dataNascimento: '',
  });

  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      await cadastrarUsuario({
        ...form,
        dataNascimento: new Date(form.dataNascimento).toISOString(),
      })
      router.push('/login');
    } catch (err) {
      console.error(err);
      setErro('Erro ao cadastrar usuário. Verifique os dados.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Usuário</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="primeiroNome"
          placeholder="Primeiro Nome"
          value={form.primeiroNome}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />
        <input
          type="text"
          name="ultimoNome"
          placeholder="Último Nome"
          value={form.ultimoNome}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />
        <input
          type="date"
          name="dataNascimento"
          value={form.dataNascimento}
          onChange={handleChange}
          required
          className="p-2 rounded bg-zinc-800"
        />

        {erro && <p className="text-red-500">{erro}</p>}

        <button
          type="submit"
          className="bg-red-800 hover:bg-red-700 transition rounded p-2 font-bold"
        >
          Cadastrar
        </button>
      </form>

      <a href="/login">Já tem cadastro? <strong>Logar!</strong></a>
    </div>
  );
}
