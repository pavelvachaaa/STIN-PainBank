"use client"

import { getAccounts } from "@/services/accounts.service";
import { IAccount } from "@/types/interfaces";
import AccountCard from "./account.component";
import React, { useContext, useEffect, useState } from "react";
import OpenAccount from "./open_account.component";
import LoadingCards from "../loading/loading.cards";
import { ModalContext } from "@/app/context/ModalContext";

async function getData(): Promise<IAccount[]> {
    let data;
    try {
        data = await getAccounts("pavel@tul.cz");
    } catch (e) {
        return [];
    }
    return data.data;
}

export default function AccountsOverview() {
    const [data, setData] = useState<IAccount[]>([])
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        getData()
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return LoadingCards()

    return (
        <>
            {(data ?? []).map((account) => <AccountCard  key={account.account_id} {...account}></AccountCard>)}
            <OpenAccount onAccountOpen={(account: IAccount) => setData([...data, account])}></OpenAccount>
        </>

    )
}