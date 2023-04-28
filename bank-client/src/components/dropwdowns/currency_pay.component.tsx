"use client"
import { IApiResponse, ICurrency } from "@/types/interfaces";
import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";


const getData = async (): Promise<ICurrency[]> => {
    const res = await fetch("http://localhost:4000/api/v1/currencies")
    const data = await res.json() as IApiResponse;

    return data?.data ?? [];
}

export default function CurrencyPay({ onDropdownChange }: { onDropdownChange: any }) {
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
            type="number"
            min={0.0}
            id="amount"
            placeholder="20 CZK"
            required={true} addon={
                <select  className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 focus:ring-2 focus:ring-inset sm:text-sm"  onChange={(val) => onDropdownChange(val.currentTarget.value ?? "")} id="currencies" required={true} >
                    {data.map((item) => <option key={item.name} value={item.name} >{item.name}</option>)}
                </select>
            }
        />
    )


}