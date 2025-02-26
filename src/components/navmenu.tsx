import { Film } from "lucide-react"
export default function Navmenu() {
    return (
        <nav className="w-screen h-18 bg-red-900 top-0 fixed flex items-center justify-start gap-10">
            <div className="p-6">
                <a href="/"><Film color="#ffffff" /></a>
            </div>
            <h1><a href="/emcartaz">Em cartaz</a></h1>
            <h1>Em breve</h1>
            <h1><a href="/sala">Sua sessão</a></h1>
            <h1><a href="/login">Login</a></h1>
            <h1><a href="/cadastro">Cadastro</a></h1>
        </nav>
    )
}