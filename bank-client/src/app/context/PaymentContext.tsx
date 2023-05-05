"use client"
import IPayment from "@/types/interfaces";
import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";


export interface PaymentContextInterface {
    payments: IPayment[]
    setPayments: Dispatch<SetStateAction<IPayment[]>>
}

const defaultState = {
    payments: [],
    setPayments: (accounts: IPayment[]) => { }
} as PaymentContextInterface;

export const PaymentContext = createContext<PaymentContextInterface>(defaultState);

export default function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<IPayment[]>([]);

    return (
        <PaymentContext.Provider value={{ payments: accounts, setPayments: setAccounts }}>
            {children}
        </PaymentContext.Provider>
    )

}