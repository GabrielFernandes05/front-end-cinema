import Fileira from "./fileira"

export default function Sala({ fileiras = [] }: { fileiras?: any[] }) {

    return (
        <div className="flex items-center justify-center flex-col w-full gap-6">
            {fileiras.map((dados) =>
                <Fileira key={dados.id} poltronas={dados.poltronas}></Fileira>
            )}
        </div>
    )
}