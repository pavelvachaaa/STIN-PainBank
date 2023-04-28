"use client"
import { IAccount } from "@/types/interfaces";
import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";


export interface AccountContextInterface {
    accounts: IAccount[]
    setAccounts: Dispatch<SetStateAction<IAccount[]>>
}

const defaultState = {
    accounts: [],
    setAccounts: (accounts: IAccount[]) => { }
} as AccountContextInterface;

export const AccountContext = createContext<AccountContextInterface>(defaultState);

export default function AccountProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<IAccount[]>([]);

    return (
        <AccountContext.Provider value={{ accounts, setAccounts }}>
            {children}
        </AccountContext.Provider>
    )

}