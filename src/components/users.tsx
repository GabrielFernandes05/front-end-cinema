'use client';

import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

export default function Users() {
    const { data, error, isLoading } = useSWR('http://localhost:8080/users/getusers', fetcher);

    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar dados</p>;

    if (!data?.Users || !Array.isArray(data.Users)) {
        return <p>Dados inválidos ou nenhum usuário encontrado</p>;
    }

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <ul>
                {data.Users.map((user: any) => (
                    <li key={user.ID}>
                        <strong>{user.name}</strong> - {user.Email} ({user.age} anos)
                    </li>
                ))}
            </ul>
        </div>
    );
}