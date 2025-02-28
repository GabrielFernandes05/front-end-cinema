'use client'
import { UsuarioService } from "@/utils/axios";
import { useState } from "react";

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
            <h1>Login</h1>
            <div className="flex justify-center items-center p-2">
                <span className="w-24 px-2 rounded-l-xl bg-zinc-900">Email</span>
                <input onChange={(e) => { setEmail(e.target.value) }} className="w-40 px-2 rounded-r-xl bg-zinc-600 outline-none" type="email" name="" id="" />
            </div>
            <div className="flex justify-center items-center p-2">
                <span className="w-24 px-2 rounded-l-xl bg-zinc-900">Password</span>
                <input onChange={(e) => { setPassword(e.target.value) }} className="w-40 px-2 rounded-r-xl bg-zinc-600 outline-none" type="password" name="" id="" />
            </div>
            <button onClick={() => { handleSubmit() }} type="button" className="bg-zinc-900 p-2 rounded-xl">Login</button>
        </form >
    )
}