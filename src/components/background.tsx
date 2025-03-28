import Navmenu from "./navmenu"

interface BackgroundProps {
    Propriedades?: string
    children?: React.ReactNode
}

export default function Background({ Propriedades = "", children }: BackgroundProps) {


    return (
        <div className={`w-screen min-h-screen bg-zinc-950 ${Propriedades}`}>
            <Navmenu></Navmenu>
            {children}
        </div>
    )
}