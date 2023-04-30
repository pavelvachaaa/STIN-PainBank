"use client"
import React, { useCallback, useContext, useState } from 'react';
import { Button, Label, Modal, Select } from "flowbite-react"
import CurrencyPay from '@/components/dropwdowns/currency_pay.component';
import { getSession } from 'next-auth/react';
import { apiCall } from '@/services/api.service';
import notify from '@/services/notification.service';
import getErrorMessage from '@/utils/error.util';
import { AccountContext } from './AccountContext';

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


    const toggleModal = ({ currency = "CZK", type = "IN" }: { currency: string, type: "IN" | "OUT" }) => {
        setCurrency(currency);
        setType(type);
        setIsOpen(!isOpen);
    };

    const updateAmount = useCallback(
        (event: any) => setAmount(Number(event.currentTarget.value)),
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

    const Dialog: any = () => {
        return (
            <Modal
                key="Modal_Transaction"
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
                            <Select value={type} onChange={updateType}>
                                <option value="IN">Vklad</option>
                                <option value="OUT">Výběr</option>
                            </Select>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="amount"
                                    value="Měna a částka"
                                />
                            </div>
                            {/* TODO: Zde se kvůli té změně statu v amount ztrácí focus */}
                            <CurrencyPay currency={currency} onDropdownChange={updateCurrency} onAmountChange={updateAmount} ></CurrencyPay>
                        </div>
                        <div className="w-full">
                            <Button onClick={() => {
                                makeTransaction({ amount: amount, type: type, currency: currency }).then((data) => {
                                    if (data) {
                                        const index = accounts.findIndex((acc) => acc.currency === data?.currency)
                                        if (index > -1) {
                                            accounts[index].balance += type == "IN" ? data?.amount : -data?.amount;
                                            console.log(accounts);
                                            setAccounts([...accounts]);
                                        }
                                        setIsOpen(false);
                                    }
                                });
                            }}>
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
            {children}
            {Dialog()}
        </ModalContext.Provider>
    );
};

