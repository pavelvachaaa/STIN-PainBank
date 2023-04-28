import { IApiResponse } from "@/types/interfaces";
import { cookies } from "next/dist/client/components/headers";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const url = process.env.API_URL ?? "http://localhost:4000/api/v1";


export const apiCall = async ({ endpoint = "", data = {}, method = "POST" }: { endpoint: string, data?: any, method?: string }) => {

    const res = await fetch(`${url}${endpoint}`, {
        method: method,
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const response = await res.json() as IApiResponse;

    if (response.responseCode != 200) {
        throw Error(response.message ?? "Někde nastala chyba");
    }

    return response;
}


