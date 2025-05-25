import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
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
        return axiosInstance.post("/login", data)
    }

    getUsuarioLogado() {
        return axiosInstance.get("/usuarios/logado")
    }
}

export class FilmeService {
  getFilmesEmCartaz() {
    return axiosInstance.get("/filmes/em-cartaz")
  }
}

export class SessaoService {
    getSessoesEmCartaz() {
      return axiosInstance.get("/sessoes/em-cartaz")
    }
    getSessaoById(id: string) {
      return axiosInstance.get(`/sessoes/${id}`)
    }
  }

  export class IngressoService {
    ComprarIngressos() {
      return axiosInstance.get("/ingressos/em-cartaz")
    }
  }
    