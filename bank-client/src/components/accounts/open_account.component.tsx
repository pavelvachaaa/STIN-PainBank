"use client"

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react"
import React, { useState } from "react"
import CurrencyDropdown from "../dropwdowns/currency.component";
import { apiCall } from "@/services/api.service";
import { getSession } from "next-auth/react";
import notify from "@/services/notification.service";
import getErrorMessage from "@/utils/error.util";
import { IAccount } from "@/types/interfaces";



/// MRDÁM TO -> nestojí  mi to za konflikty mezi apiCall a authApiCall, abych to strkal do .service
const openAccount = async (currency: string): Promise<IAccount | null> => {
    const session = await getSession()
    try {
        const res = await apiCall({ endpoint: "/account/open", data: { email: session?.user?.email, currency: currency } })
        notify({ message: res.message, type: "success" })

        return res.data;
    } catch (e) {
        notify({ message: getErrorMessage(e), type: "error" })
        return null;
    }
}


export default function OpenAccount({ onAccountOpen }: { onAccountOpen: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currency, setCurrency] = useState("AUD");

    return (
        <>

            <div className="text-center border border-gray-400 p-4 rounded-xl border-dashed  h-fit hover:bg-blend-darken">
                <h1 className=" text-gray-500 font-semibold text-2xl p-3">Vytvořit další účet</h1>
                <p className="text-gray-500 font-medium">Můžete si u nás otěvřít účet v libovolné měně</p>
                <button onClick={() => setIsOpen(true)} className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    + Otevřít účet
                </button>
            </div>
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
                            Vytvořte si u nás další účet
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="amount"
                                    value="Měna"
                                />
                            </div>
                            <CurrencyDropdown onDropdownChange={(val: string) => setCurrency(val)}></CurrencyDropdown>
                        </div>
                        <div className="w-full">
                            <Button onClick={() => {
                                openAccount(currency).then((data) => {
                                    if (data) {
                                        setIsOpen(false)
                                        onAccountOpen(data)
                                    }
                                });
                            }}>
                                Otevřít účet
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}