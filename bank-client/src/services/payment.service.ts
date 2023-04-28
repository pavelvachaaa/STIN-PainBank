import { authApiCall } from "./apiAuth.service"

export const getPayments = async (email: string) => {
    const response = await authApiCall({ endpoint: "/payments/history", data: { email: email } })
    return response
}