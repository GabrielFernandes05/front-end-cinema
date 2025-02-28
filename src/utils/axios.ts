import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class UsuarioService {

    loginUsuario(data: { email: string, password: string }) {
        return axiosInstance.post("/api/v1/login", data)
    }

}