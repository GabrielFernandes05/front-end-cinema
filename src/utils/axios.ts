import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
  return await axiosInstance.post("/api/v1/login", {
    email,
    password,
  });
};

export const cadastrarUsuario = async (userData: {
  name: string;
  email: string;
  password: string;
  dataNascimento: string;
}) => {
  return await axiosInstance.post("/api/v1/usuarios", userData);
};

export class UsuarioService {
  async getUsuarioLogado() {
    return await axiosInstance.get("/api/v1/usuarios/logado");
  }

  async getUsuarios() {
    return await axiosInstance.get("/api/v1/usuarios");
  }

  async getUsuarioById(id: string) {
    return await axiosInstance.get(`/api/v1/usuarios/${id}`);
  }

  async updateUsuario(userData: any) {
    return await axiosInstance.put("/api/v1/usuarios", userData);
  }

  async deleteUsuario(id: string) {
    return await axiosInstance.delete(`/api/v1/usuarios/${id}`);
  }
}

export class FilmeService {
  async getFilmes() {
    return await axiosInstance.get("/api/v1/filmes");
  }

  async getFilmesEmCartaz() {
    return await axiosInstance.get("/api/v1/filmes/em-cartaz");
  }

  async getFilmeById(id: string) {
    return await axiosInstance.get(`/api/v1/filmes/${id}`);
  }

  async criarFilme(filmeData: any) {
    return await axiosInstance.post("/api/v1/filmes", filmeData);
  }

  async updateFilme(id: string, filmeData: any) {
    return await axiosInstance.put(`/api/v1/filmes/${id}`, filmeData);
  }

  async deleteFilme(id: string) {
    return await axiosInstance.delete(`/api/v1/filmes/${id}`);
  }
}

export class SessaoService {
  async getSessoes() {
    return await axiosInstance.get("/api/v1/sessoes");
  }

  async getSessoesEmCartaz() {
    return await axiosInstance.get("/api/v1/sessoes/em-cartaz");
  }

  async getSessaoById(id: string) {
    return await axiosInstance.get(`/api/v1/sessoes/${id}`);
  }

  async criarSessao(sessaoData: any) {
    return await axiosInstance.post("/api/v1/sessoes", sessaoData);
  }

  async updateSessao(id: string, sessaoData: any) {
    return await axiosInstance.put(`/api/v1/sessoes/${id}`, sessaoData);
  }

  async deleteSessao(id: string) {
    return await axiosInstance.delete(`/api/v1/sessoes/${id}`);
  }
}

export class SalaService {
  async getSalas() {
    return await axiosInstance.get("/api/v1/salas");
  }

  async getSalaById(id: string) {
    return await axiosInstance.get(`/api/v1/salas/${id}`);
  }

  async getSalasDropdown() {
    return await axiosInstance.get("/api/v1/salas/dropdown");
  }
}

export class GeneroService {
  async getGeneros() {
    return await axiosInstance.get("/api/v1/generos");
  }

  async getGeneroById(id: string) {
    return await axiosInstance.get(`/api/v1/generos/${id}`);
  }

  async getGenerosDropdown() {
    return await axiosInstance.get("/api/v1/generos/dropdown");
  }
}

export class IngressoService {
  async comprarIngressos(sessaoId: string, poltronas: string[]) {
    return await axiosInstance.post("/api/v1/ingressos", {
      sessaoId,
      poltronas,
    });
  }

  async getPoltronasDisponiveis(idSessao: string) {
    return await axiosInstance.get(
      `/api/v1/ingressos/poltronas-disponiveis/${idSessao}`
    );
  }

  async getMeusIngressos() {
    return await axiosInstance.get("/api/v1/usuarios/logado/ingressos");
  }
}

export default axiosInstance;
