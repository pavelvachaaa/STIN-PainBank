import { IApiResponse } from "@/types/interfaces";
import { getServerSession } from "next-auth";
const url = process.env.API_URL ?? "http://localhost:4000/api/v1";

/**
 * Vznikla tato druhá separátní metoda. Jakmile je uživatel odhlášený a zároven je tohle někde includnutý chybuje to
 * Respektive getServerSession chybuje
 * @returns 
 */
export const authApiCall = async ({ endpoint = "", data = {}, method = "POST" }: { endpoint: string, data?: any, method?: string }) => {
    let session;
    try {
        session = await getServerSession()
    } catch (e) {
        throw new Error("Nemohli jsme vás autorizovat");
    }

    const res = await fetch(`${url}${endpoint}`, {
        method: method,
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${session?.user?.image}` // Je zde user.image, protože protože z nějakého důvodu to nebere next-auth-d.ts
        },
        body: JSON.stringify(data)
    })

    const response = await res.json() as IApiResponse;

    if (response.responseCode != 200) {
        throw new Error(response.message ?? "Někde nastala chyba");
    }

    return response;
}