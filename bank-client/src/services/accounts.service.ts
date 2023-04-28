// import { authApiCall } from "./apiAuth.service"

import { apiCall } from "./api.service"

export const getAccounts = async (email: string) => {
    const response = await apiCall({ endpoint: "/account/get", data: { email: email } })
    return response
}