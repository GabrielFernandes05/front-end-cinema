import Background from "@/components/background"
import Navmenu from "@/components/navmenu"
import LoginForm from "@/components/loginform"

export default function Home() {
    return (
        <Background Propriedades="flex items-center justify-center">
            <LoginForm></LoginForm>
        </Background>
    )
}