import Sala from "@/components/sala"
import Background from "@/components/background"
export default function Home() {

    let dados = [{
        "id": 0,
        "poltronas": [{
            "id": 0,
            "disponivel": false,
            "habilitado": true,
        },
        {
            "id": 1,
            "disponivel": true,
            "habilitado": false,
        },
        {
            "id": 2,
            "disponivel": true,
            "habilitado": true,
        },
        {
            "id": 3,
            "disponivel": true,
            "habilitado": true,
        }]
    },
    {
        "id": 1,
        "poltronas": [{
            "id": 0,
            "disponivel": true,
            "habilitado": true,
        }]
    },
    {
        "id": 2,
        "poltronas": [{
            "id": 0,
            "disponivel": true,
            "habilitado": true,
        }]
    },
    {
        "id": 3,
        "poltronas": [{
            "id": 0,
            "disponivel": true,
            "habilitado": true,
        }]
    }
    ]

    return (
        <Background Propriedades="flex items-center justify-center">
            <Sala fileiras={dados}></Sala>
        </Background>
    )
}