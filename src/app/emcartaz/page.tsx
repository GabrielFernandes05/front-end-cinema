import Cartaz from "@/components/cartaz"
import Background from "@/components/background"
export default function Home() {
    return (
        <Background Propriedades="flex items-center justify-around">
            <Cartaz filme={{ "nome": "Temporada de Caça" }}></Cartaz>
            <Cartaz filme={{ "nome": "Up Altas Aventuras" }}></Cartaz>
            <Cartaz filme={{ "nome": "Sim Senhor" }}></Cartaz>
        </Background>
    )
}