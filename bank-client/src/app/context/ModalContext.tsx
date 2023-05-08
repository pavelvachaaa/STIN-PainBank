"use client"
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button, Label, Modal, Select, TextInput } from "flowbite-react"
import CurrencyPay from '@/components/dropwdowns/currency_pay.component';
import { getSession } from 'next-auth/react';
import { apiCall } from '@/services/api.service';
import notify from '@/services/notification.service';
import getErrorMessage from '@/utils/error.util';
import { AccountContext } from './AccountContext';
import { PaymentContext } from './PaymentContext';
import IPayment, { ICurrency } from '@/types/interfaces';
import LoadingCards from '@/components/loading/loading.cards';

type ModalContextType = {
    isOpen: boolean;
    toggleModal: ({ currency = "CZK", type = "IN" }: { currency: string, type: "IN" | "OUT" }) => void;
};

export const ModalContext = React.createContext<ModalContextType>({
    isOpen: false,
    toggleModal: () => { },
});


type ModalProviderProps = {
    children: React.ReactNode;
};


/// MRDÁM TO -> nestojí  mi to za konflikty mezi apiCall a authApiCall, abych to strkal do .service
export const makeTransaction = async ({ currency, amount, type }: { currency: string, amount: number, type: "IN" | "OUT" }): Promise<any> => {
    const session = await getSession()
    try {
        const res = await apiCall({ endpoint: `/account/${type == "IN" ? "deposit" : "withdraw"}`, data: { email: session?.user?.email, currency: currency, amount: amount } })
        notify({ message: res.message, type: "success" })

        return res.data;
    } catch (e) {
        notify({ message: getErrorMessage(e), type: "error" })
        return null;
    }
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currency, setCurrency] = useState<string>("CZK");
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<"IN" | "OUT">("IN");
    const { accounts, setAccounts } = useContext(AccountContext);
    const { payments, setPayments } = useContext(PaymentContext);

    const toggleModal = ({ currency = "CZK", type = "IN" }: { currency: string, type: "IN" | "OUT" }) => {
        setCurrency(currency);
        setType(type);
        setIsOpen(!isOpen);
    };

    const updateAmount = useCallback(
        (event: any) => {
            console.log("JO", event);
            setAmount(Number(event.currentTarget.value))
        },
        [amount]
    );

    const updateCurrency = useCallback(
        (event: any) => setCurrency(event),
        [currency]
    )

    const updateType = useCallback(
        (event: any) => setType((event.currentTarget.value ?? "IN") as "IN" | "OUT"),
        [type]
    )

    const defaultState = () => {
        setAmount(0);
    }

    return (
        <React.Fragment>
            <ModalContext.Provider value={{ isOpen, toggleModal }}>
                {children}
                {isOpen &&
                    <div className="fixed inset-0 z-10 overflow-y-auto ">
                        <div className="fixed inset-0 w-full h-full bg-gray-900 opacity-70" onClick={() => { defaultState(); setIsOpen(false) }} ></div>
                        <div className="flex items-center min-h-screen px-2 py-2 ">
                            <div className="relative w-9/12 max-w-lg p-8 mx-auto bg-white dark:bg-gray-700 rounded-md shadow-lg">
                                <div className="mt-3 mb-3 sm:flex">
                                    <div className="mt-2 sm:ml-4 sm:text-left">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                            Zde můžete provést transakci
                                            <p className="text-sm text-gray-500 font-normal pt-1">Pokračujte výběřem typu transakce a následně měny a částky</p>
                                        </h3>
                                        <div className="mt-4">
                                            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Typ</label>
                                            <select id="type" value={type} onChange={updateType} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
                                                <option value="IN">Vklad</option>
                                                <option value="OUT">Výběr</option>
                                            </select>
                                            <label htmlFor="amount" className="block mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Měna a částka</label>
                                            <CurrencyPay amount={amount} currency={currency} onDropdownChange={updateCurrency} onAmountChange={updateAmount} ></CurrencyPay>
                                            <div className="items-center gap-2 mt-6 sm:flex">
                                                <button type="submit" onClick={() => {
                                                    makeTransaction({ amount: amount, type: type, currency: currency }).then((data) => {
                                                        if (data) {
                                                            const index = accounts.findIndex((acc) => acc.currency === data?.currency)

                                                            if (index > -1) {
                                                                accounts[index].balance += type == "IN" ? data?.amount : -data?.amount;
                                                                setAccounts([...accounts]);
                                                                setPayments([{ amount: data?.amount, type: type, currency: data?.currency, timestamp: Date.now(), email: data?.email }, ...payments]);
                                                            }

                                                            defaultState()
                                                            setIsOpen(false);
                                                        }
                                                    });
                                                }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Provést platbu</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                }

            </ModalContext.Provider>
        </React.Fragment>

    );
};

