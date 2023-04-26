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

export const authenticate = async (data: AuthenticateDTO) => {
    const response = await apiCall({ endpoint: "/auth/authenticate", data: data })
    return response
}


export const register = async (data: CreateAccountDTO) => {
    const response = await apiCall({ endpoint: "/users/register", data: data })
    return response
}