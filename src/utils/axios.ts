import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
})

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export class UsuarioService {
    loginUsuario(data: { email: string, password: string }) {
        return axiosInstance.post("/api/v1/login", data)
    }

    getUsuarioLogado() {
        return axiosInstance.get("/api/v1/usuarios/logado")
    }
}

export class FilmeService {
  getFilmesEmCartaz() {
    return axiosInstance.get("/api/v1/filmes/em-cartaz")
  }
}

export class SessaoService {
  getSessoesEmCartaz() {
    return axiosInstance.get("/api/v1/sessoes/em-cartaz")
  }
  getSessaoById(id: string) {
    return axiosInstance.get(`/api/v1/sessoes/${id}`)
  }
}
