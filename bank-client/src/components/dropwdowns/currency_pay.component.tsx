"use client"
import { apiCall } from "@/services/api.service";
import { IApiResponse, ICurrency } from "@/types/interfaces";
import { Select, TextInput } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";

const getData = async (): Promise<ICurrency[]> => {
    const res = await apiCall({ endpoint: "/currencies", method: "GET" })
    return res?.data ?? [];
}

export default function CurrencyPay({ onDropdownChange, onAmountChange, currency = "CZK" }: { onDropdownChange: any, onAmountChange: any, currency: string }) {
    const [data, setData] = useState<ICurrency[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getData()
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    return (
        <TextInput
            autoFocus={true}
            key="input"
            type="number"
            onChange={onAmountChange}
            min={0.0}
            id="amount"
            placeholder="20"
            required={true} addon={
                <select value={currency} className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 focus:ring-2 focus:ring-inset sm:text-sm" onChange={(val) => onDropdownChange(val.currentTarget.value ?? "")} id="currencies" required={true} >
                    {data.map((item) => <option key={item.name} value={item.name} >{item.name}</option>)}
                </select>
            }
        />
    )


}