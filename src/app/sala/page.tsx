import Sala from "@/components/sala"
import Navmenu from "@/components/navmenu"
export default function Home() {

    let dados = [{
        "id" : 0,
        "poltronas" : [{
            "id" : 0,
            "disponivel" : false,
            "habilitado" : true,
        },
        {
            "id" : 1,
            "disponivel" : true,
            "habilitado" : false,
        },
        {
            "id" : 2,
            "disponivel" : true,
            "habilitado" : true,
        },
        {
            "id" : 3,
            "disponivel" : true,
            "habilitado" : true,
        }]
    },
    {
        "id" : 1,
        "poltronas" : [{
            "id" : 0,
            "disponivel" : true,
            "habilitado" : true,
        }]
    },
    {
        "id" : 2,
        "poltronas" : [{
            "id" : 0,
            "disponivel" : true,
            "habilitado" : true,
        }]
    },
    {
        "id" : 3,
        "poltronas" : [{
            "id" : 0,
            "disponivel" : true,
            "habilitado" : true,
        }]
    }
]

    return (
        <div className="w-screen h-screen bg-zinc-950 flex items-center justify-center gap-4">
            <Navmenu></Navmenu>
            <Sala fileiras={dados}></Sala>
        </div>
    )
}