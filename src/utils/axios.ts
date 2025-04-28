import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
})

export class UsuarioService {

    loginUsuario(data: { email: string, password: string }) {
        return axiosInstance.post("/api/v1/login", data)
    }

}