import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/usuarios/logado")
    ) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  return await axiosInstance.post("/login", {
    email,
    password,
  });
};

export const cadastrarUsuario = async (dados: {
  name: string;
  cpf: string;
  email: string;
  password: string;
  dataNascimento: string;
}) => {
  const response = await axiosInstance.post('/usuarios', dados);
  return response.data;
};

export class UsuarioService {
  loginUsuario(data: { email: string, password: string }) {
    return axiosInstance.post("/login", data)
  }

  getUsuarioLogado() {
    return axiosInstance.get("/usuarios/logado")
  }

  async getUsuarios() {
    return await axiosInstance.get("/usuarios");
  }

  async getUsuarioById(id: string) {
    return await axiosInstance.get(`/usuarios/${id}`);
  }

  async updateUsuario(userData: any) {
    return await axiosInstance.put("/usuarios", userData);
  }

  async deleteUsuario(id: string) {
    return await axiosInstance.delete(`/usuarios/${id}`);
  }
}

export class FilmeService {
  getFilmesEmCartaz() {
    return axiosInstance.get("/filmes/em-cartaz")
  }

  async getFilmes() {
    return await axiosInstance.get("/filmes");
  }

  async getFilmeById(id: string) {
    return await axiosInstance.get(`/filmes/${id}`);
  }

  async criarFilme(filmeData: any) {
    return await axiosInstance.post("/filmes", filmeData);
  }

  async updateFilme(id: string, filmeData: any) {
    return await axiosInstance.put(`/filmes/${id}`, filmeData);
  }

  async deleteFilme(id: string) {
    return await axiosInstance.delete(`/filmes/${id}`);
  }
}

export class SessaoService {
  getSessoesEmCartaz() {
    return axiosInstance.get("/sessoes/em-cartaz")
  }

  getSessaoById(id: string) {
    return axiosInstance.get(`/sessoes/${id}`)
  }

  async getSessoes() {
    return await axiosInstance.get("/sessoes");
  }

  async criarSessao(sessaoData: any) {
    return await axiosInstance.post("/sessoes", sessaoData);
  }

  async updateSessao(id: string, sessaoData: any) {
    return await axiosInstance.put(`/sessoes/${id}`, sessaoData);
  }

  async deleteSessao(id: string) {
    return await axiosInstance.delete(`/sessoes/${id}`);
  }
}

export class IngressoService {
  ComprarIngressos(idSessao: string, poltronas: string[]) {
    return axiosInstance.post("/ingressos", {
      idSessao,
      poltronas
    })
  }

  async getPoltronasDisponiveis(idSessao: string) {
    return await axiosInstance.get(
      `/ingressos/poltronas-disponiveis/${idSessao}`
    );
  }
}

export default axiosInstance;
