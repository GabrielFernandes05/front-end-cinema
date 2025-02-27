import axios from "axios";

type getDataProps = {
    code: number,
    description: string
}

const getData = async () => {
    try {
        const response = await axios.get<getDataProps>('https://httpstat.us/200')
        if (response.status !== 200) {
            throw new Error(`status code: ${response.status}}`)
        }
        return response.data;
    }
    catch (error) {
        throw error
    }
}

export default async function Users() {

    try {
        const response = await getData()
        return (
            <div>
                <h1>Users</h1>
                <p>{response.code}</p>
                <p>{response.description}</p>
            </div>
        )
    } catch (error) {
        console.error(error)
        return (
            <div>
                <h1>Error</h1>
            </div>
        )
    }


}