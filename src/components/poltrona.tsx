import { Armchair } from "lucide-react"

interface PoltronaProps {
    Disponivel?: boolean
    Habilitado?: boolean
}

export default function Poltrona({ Disponivel = true, Habilitado = true }: PoltronaProps) {
    let bg = Disponivel ? 'bg-green-300' : 'bg-red-300'
    let bgHover = Disponivel ? 'hover:bg-green-400' : 'hover:bg-red-400'
    let bgActive = Disponivel ? 'active:bg-green-500' : 'active:bg-red-500'
    if (Habilitado == false) { bg = 'bg-gray-300', bgHover = 'hover:bg-gray-400', bgActive = 'active:bg-gray-500' }
    return (
        <div className={`p-2 rounded-xl shadow-black shadow-md ${bg} ${bgHover} ${bgActive} active:scale-95 duration-300`}>
            <Armchair color="#000000"></Armchair>
        </div>
    )
}