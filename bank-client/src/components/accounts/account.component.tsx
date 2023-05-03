"use client"
import { ModalContext } from "@/app/context/ModalContext";
import { IAccount } from "@/types/interfaces";
import { useContext } from "react";

export default function AccountCard({ account_id, currency, balance }: IAccount) {
    const { toggleModal } = useContext(ModalContext);

    return (
        <div className="w-full p-4 h-fit max-w-screen-md bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold text-gray-700 dark:text-white">Účet G2.2<p className="text-sm text-gray-500 font-normal pt-1">{account_id}</p> </h5>
                <div className="relative flex justify-around">
                    <div className="flex">
                        <span className="-ml-6 text-xl font-bold text-sky-500">{currency}</span>
                        <span className="leading-0 text-4xl font-bold text-gray-800 dark:text-white">{balance.toFixed(2)}</span>
                    </div>
                </div>
            </div>


            <div className="flex gap-5 pt-5">
                <button onClick={() => toggleModal({ type: "IN", currency: currency })} className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-sky-50 before:border before:border-sky-500 dark:before:border-gray-600 dark:before:bg-gray-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                    <span className="relative text-base font-semibold text-sky-600 dark:text-white">Vložit</span>
                </button>
                <button onClick={() => toggleModal({ type: "OUT", currency: currency })} className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-sky-50 before:border before:border-sky-500 dark:before:border-gray-600 dark:before:bg-gray-700 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
                    <span className="relative text-base font-semibold text-sky-600 dark:text-white">Vybrat</span>
                </button>
            </div>
        </div>
    )
}