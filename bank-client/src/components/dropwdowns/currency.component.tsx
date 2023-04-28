"use client"
import { apiCall } from "@/services/api.service";
import { IApiResponse, ICurrency } from "@/types/interfaces";
import { Select } from "flowbite-react";
import { useEffect, useState } from "react";

const getData = async (): Promise<ICurrency[]> => {
    const res = await apiCall({ endpoint: "/currencies", method: "GET" })
    return res?.data ?? [];
}

export default function CurrencyDropdown({ onDropdownChange }: { onDropdownChange: any }) {
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
        <Select onChange={(val) => onDropdownChange(val.currentTarget.value ?? "")} id="currencies" required={true} >
            {data.map((item) => <option value={item.name} key={item.name} >{item.name}</option>)}
        </Select>
    )


}