'use client'
import { UsuarioService } from "@/utils/axios";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

const usuarioService = new UsuarioService()

export default function LoginForm() {
    const [useEmail, setEmail] = useState<String>()
    const [usePassword, setPassword] = useState<String>()

    const handleSubmit = () => {
        usuarioService.loginUsuario({
            email: String(useEmail),
            password: String(usePassword)
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.error(error)
            })

    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col gap-5 rounded-xl shadow-inner shadow-black p-4">
            <h1 className="font-bold tracking-widest text-4xl">Login</h1>
            <div className="flex justify-center items-center p-2">
                <span className="p-3 rounded-l-xl bg-zinc-900"><Mail /></span>
                <input onChange={(e) => { setEmail(e.target.value) }} className="w-44 px-2 py-3 rounded-r-xl bg-zinc-600 outline-none" type="email" name="" id="" placeholder="Insira seu email..." />
            </div>
            <div className="flex justify-center items-center p-2">
                <span className="p-3 rounded-l-xl bg-zinc-900"><Lock /></span>
                <input onChange={(e) => { setPassword(e.target.value) }} className="w-44 px-2 py-3 rounded-r-xl bg-zinc-600 outline-none" type="password" name="" id="" placeholder="Insira sua senha..." />
            </div>
            <button type="button" onClick={() => { handleSubmit() }} className="bg-zinc-900 py-2 px-4 rounded-xl italic text-2xl tracking-widest hover:bg-zinc-800 active:bg-blue-700 duration-300 active:scale-95">GO!</button>
        </form >
    )
}