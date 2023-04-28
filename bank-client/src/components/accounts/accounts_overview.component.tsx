"use client"

import { getAccounts } from "@/services/accounts.service";
import { IAccount } from "@/types/interfaces";
import AccountCard from "./account.component";
import React, { useContext, useEffect, useState } from "react";
import OpenAccount from "./open_account.component";
import LoadingCards from "../loading/loading.cards";
import { ModalContext } from "@/app/context/ModalContext";
import { AccountContext } from "@/app/context/AccountContext";

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
    const [isLoading, setLoading] = useState(false)
    const {accounts, setAccounts } = useContext(AccountContext);

    useEffect(() => {
        setLoading(true)
        getData()
            .then((data) => {
                setLoading(false)
                setAccounts(data ?? [])
            })
    }, [])

    if (isLoading) return LoadingCards()

    return (
        <>
            {(accounts ?? []).map((account) => <AccountCard key={account.account_id} {...account}></AccountCard>)}
            <OpenAccount onAccountOpen={(account: IAccount) => setAccounts([...accounts, account])}></OpenAccount>
        </>

    )
}