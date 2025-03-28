export default function FilmeForm() {
    return (
        <form className="flex items-center justify-center flex-col gap-5 rounded-xl shadow-inner shadow-black p-4 mt-28">
            <h1 className="font-bold tracking-widest text-4xl">Cadastrar um filme</h1>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Nome</p>
                <input className="bg-zinc-600 rounded-b-xl p-2 outline-none" type="text" name="" id="" placeholder="Insira o nome do filme..." />
            </div>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Sinopse</p>
                <textarea className="bg-zinc-600 rounded-b-xl p-2 outline-none" name="" id="" cols={30} rows={10}></textarea>
            </div>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Diretor</p>
                <input className="bg-zinc-600 rounded-b-xl p-2 outline-none" type="text" name="" id="" placeholder="Insira o diretor do filme..." />
            </div>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Duração</p>
                <input className="bg-zinc-600 rounded-b-xl p-2 outline-none" type="number" name="" id="" min="0" step="1" placeholder="Insira a duração do filme..." />
            </div>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Gênero</p>
                <select className="bg-zinc-600 rounded-b-xl p-2 outline-none" name="" id="" defaultValue={""}>
                    <option value="" disabled>Selecione o gênero do filme...</option>
                    <option value="action">Ação</option>
                    <option value="comedy">Comédia</option>
                    <option value="drama">Drama</option>
                    <option value="horror">Terror</option>
                </select>
            </div>
            <div className="flex flex-col w-72">
                <p className="bg-zinc-900 rounded-t-xl p-2">Nota</p>
                <input className="bg-zinc-600 rounded-b-xl p-2 outline-none" type="number" name="" id="" min="0" max="10" step="1" placeholder="Insira a nota do filme..." />
            </div>
            <button type="button" className="bg-zinc-900 py-2 px-4 rounded-xl italic text-2xl tracking-widest hover:bg-zinc-800 active:bg-blue-700 duration-300 active:scale-95">GO!</button>
        </form>
    )
}