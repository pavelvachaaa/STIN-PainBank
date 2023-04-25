import { IApiResponse } from "@/types/interfaces";

const url = process.env.API_URL ?? "http://localhost:4000/api/v1";

const apiCall = async ({ endpoint = "", data={}, method = "POST" }: { endpoint: string, data?: any, method?: string }) => {
    const res = await fetch(`${url}${endpoint}`, {
        method: method,
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const response = await res.json() as IApiResponse;

    if (response.responseCode != 200) {
        throw Error(response.message ?? "Někde nastala chyba");
    }

    return response;
}

export default apiCall;