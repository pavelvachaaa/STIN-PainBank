import { IApiResponse } from "@/types/interfaces";
import apiCall from "./api.service";

export interface CreateAccountDTO {
    name: string;
    password: string;
    email: string;
}

export interface StartAuthDTO {
    password: string;
    email: string;
}

export interface AuthenticateDTO {
    code?: number;
    auth_request_id: string;
}

export const startAuth = async (data: StartAuthDTO) => {
    const response = await apiCall({ endpoint: "/auth/startAuthentication", data: data })
    return response
}


/// TODO: udělat něco jako appService.call("api/v1", data)
export const register = async (data: CreateAccountDTO) => {
    const res = await fetch("http://localhost:4000/api/v1/users/register", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const response = await res.json() as IApiResponse;

    if (response.responseCode != 200) {
        throw Error("Nastala chyba"); //throw message i guess
    }
    return response;
}