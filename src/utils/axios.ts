import axios from "axios";

type DataProps = {
    error: string,
    data: string
}


const loginUser = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post<DataProps>("http://localhost:8080/api/v1/login", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro na requisição:", error.message);
            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
            } else if (error.request) {
                console.error("Sem resposta do servidor:", error.request);
            } else {
                console.error("Erro desconhecido:", error.message);
            }
        } else {
            console.error("Erro inesperado:", error);
        }
        throw error;
    }
};

export default loginUser;