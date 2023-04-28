"use client"

import React, { useContext, useState } from 'react';
import { Button, Label, Modal, Select, TextInput } from "flowbite-react"
import CurrencyDropdown from '@/components/dropwdowns/currency.component';
import CurrencyPay from '@/components/dropwdowns/currency_pay.component';
import { getSession } from 'next-auth/react';
import { apiCall } from '@/services/api.service';
import notify from '@/services/notification.service';
import getErrorMessage from '@/utils/error.util';

type ModalContextType = {
    isOpen: boolean;
    toggleModal: (isOpen: boolean) => void;
};

export const ModalContext = React.createContext<ModalContextType>({
    isOpen: false,
    toggleModal: (val: boolean) => { },
});


type ModalProviderProps = {
    children: React.ReactNode;
};


/// MRDÁM TO -> nestojí  mi to za konflikty mezi apiCall a authApiCall, abych to strkal do .service
const openAccount = async ({ currency, amount, type }: { currency: string, amount: number, type: "IN" | "OUT" }): Promise<any> => {
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
    const [isOpen, setIsOpen] = useState(false);
    const [currency, setCurrency] = useState("CZK");
    const [type, setType] = useState<"IN"|"OUT">("IN");

    const toggleModal = () => {
        console.log("Toggled")
        setIsOpen(!isOpen);
    };

    const Dialog: any = () => {
        return (
            <Modal
                show={isOpen}
                size="md"
                popup={true}
                onClose={() => { setIsOpen(false) }}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Zde můžete provést transakci
                            <p className="text-sm text-gray-500 font-normal pt-1">Pokračujte výběřem typu transakce a následně měny a částky</p>
                        </h3>
                        <div>
                            <div className="mb-1 block">
                                <Label
                                    htmlFor="type"
                                    value="Typ"
                                />
                            </div>
                            <Select  onChange={(val) => setType((val.currentTarget.value ?? "IN") as "IN" | "OUT")}>
                                <option value="IN">Vklad</option>
                                <option value="OUT">Výběr</option>
                            </Select>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="amount"
                                    value="Měna"
                                />
                            </div>
                            <CurrencyPay onDropdownChange={(val: string) => setCurrency(val)}></CurrencyPay>
                        </div>
                        <div className="w-full">
                            <Button onClick={() => openAccount({amount: 100, type: type,currency: currency})}>
                                Provést platbu
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    };

    return (
        <ModalContext.Provider value={{ isOpen, toggleModal }}>
            {isOpen ? (
                Dialog()
            ) : <></>}
            {children}
        </ModalContext.Provider>
    );
};

