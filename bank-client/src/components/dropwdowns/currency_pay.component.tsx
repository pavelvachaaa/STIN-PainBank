"use client"
import { apiCall } from "@/services/api.service";
import { ICurrency } from "@/types/interfaces";
import { useEffect, useState } from "react";

const getData = async (): Promise<ICurrency[]> => {
    const res = await apiCall({ endpoint: "/currencies", method: "GET" })
    return res?.data ?? [];
}

const LoadingInput = () => {
    return <div role="status" className="space-y-2.5 animate-pulse max-w-screen-md">
        <div className="flex items-center max-w-screen-md space-x-2">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
        </div>
        <div className="flex items-center w-full space-x-2 max-w-[480px]">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
        </div>
    </div>
}

export default function CurrencyPay({ onDropdownChange, onAmountChange, currency = "CZK", amount }: { onDropdownChange: any, onAmountChange: any, currency: string, amount: number }) {
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

    if (isLoading) return <LoadingInput></LoadingInput>

    return (
        <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <select value={currency} className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 focus:ring-2 focus:ring-inset sm:text-sm" onChange={(val) => onDropdownChange(val.currentTarget.value ?? "")} id="currencies" required={true}>
                    {data.map((item) => <option key={item.name} value={item.name} >{item.name}</option>)}
                </select>
            </span>

            <input autoFocus={true}
                type="number"
                value={amount}
                onChange={onAmountChange}
                min={0.0}
                id="amount"
                placeholder="20"
                required={true} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
    )
}