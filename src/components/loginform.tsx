'use client'
import { useState } from "react";
import loginUser from "@/utils/axios";
interface loginData {
    email: string,
    password: string
}

export default function LoginForm() {
    const [formData, setFormData] = useState<loginData>({ email: "", password: "" })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            console.log("Login bem-sucedido:", response);
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="flex justify-center items-center p-2">
                <span className="w-24 px-2 rounded-l-xl bg-zinc-900">Email</span>
                <input value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="px-2 rounded-r-xl bg-zinc-500 outline-none" type="email" name="" id="" />
            </div>
            <div className="flex justify-center items-center p-2">
                <span className="w-24 px-2 rounded-l-xl bg-zinc-900">Password</span>
                <input value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} className="px-2 rounded-r-xl bg-zinc-500 outline-none" type="password" name="" id="" />
            </div>
            <button onClick={() => { loginUser(formData) }} type="button" className="bg-zinc-900 p-2">Login</button>
        </form >
    )
}