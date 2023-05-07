import { apiCall } from "./api.service"

export const getPayments = async (email: string) => {
    const response = await apiCall({ endpoint: "/payments/history", data: { email: email } })
    return response
}