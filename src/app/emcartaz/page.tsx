import Navmenu from "@/components/navmenu"
import Cartaz from "@/components/cartaz"
export default function Home() {
    return (
        <div className="w-screen h-screen bg-zinc-950 flex items-center justify-around gap-10">
            <Navmenu></Navmenu>
            <Cartaz filme={{ "nome": "Temporada de Caça" }}></Cartaz>
            <Cartaz filme={{ "nome": "Up Altas Aventuras" }}></Cartaz>
            <Cartaz filme={{ "nome": "Sim Senhor" }}></Cartaz>
        </div>
    )
}