import Poltrona from "./poltrona"

export default function Fileira({ poltronas = [] }: { poltronas?: any[] }) {

    return (
        <div className="w-auto h-16 bg-zinc-900 shadow-md shadow-black rounded-xl flex items-center justify-center gap-6 px-3">
            {
                poltronas.map((obj: any) =>
                    <Poltrona key={obj.id} Disponivel={obj.disponivel} Habilitado={obj.habilitado} />
                )
            }
        </div>
    )
}