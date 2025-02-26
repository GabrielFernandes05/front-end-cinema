import Background from "@/components/background"
import Navmenu from "@/components/navmenu"

export default function Home() {
    return (
        <Background Propriedades="flex items-center justify-center">
            <form action="" className="p-4 shadow-black shadow-md rounded-xl flex flex-col items-center gap-6 bg-zinc-900">
                <h1 className="font-bold text-2xl">Login</h1>

                <input type="text" name="" id="" className="bg-red-950 w-full p-2 shadow-black shadow-md rounded-xl outline-none placeholder-white" placeholder="Login..." />
                <input type="password" name="" id="" className="bg-red-950 w-full p-2 shadow-black shadow-md rounded-xl outline-none placeholder-white" placeholder="Password..." />


                <div className="flex items-center justify-center gap-6 w-full">
                    <button type="submit" className="bg-red-950 w-full p-2 shadow-black shadow-md rounded-xl hover:bg-red-900 active:bg-red-800 active:scale-95 duration-300">
                        Login
                    </button>
                    <button className="bg-red-950 w-full p-2 shadow-black shadow-md rounded-xl hover:bg-red-900 active:bg-red-800 active:scale-95 duration-300">
                        <a href="/cadastro" >Sign Up</a>
                    </button>
                </div>

            </form>
        </Background>
    )
}