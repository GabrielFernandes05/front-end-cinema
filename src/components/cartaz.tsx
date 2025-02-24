export default function Cartaz({ filme = {} }: { filme?: any }) {
    return (
        <div className=" w-1/6 h-2/3 rounded-xl relative flex flex-col gap-1">
            <div className="rounded-xl absolute left-0 top-0 bg-white opacity-30 p-3">
                <h1 className="text-black">Assista já</h1>
            </div>
            <div className="bg-zinc-900 w-full h-full rounded-xl shadow-black shadow-md">
            </div>
            <div className="bg-zinc-950 w-full h-32 rounded-xl shadow-black shadow-md p-3 flex flex-col justify-between">
                <h1>{filme.nome}</h1>
                <button className="rounded-xl shadow-black shadow-md w-2/3 p-3 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 active:scale-95 font-bold duration-300">Comprar ingresso!</button>
            </div>
        </div>
    )
}