"use client";
import IPayment from "@/types/interfaces";
import groupBy from "@/utils/array.util";
import { Dropdown, Pagination, Table } from "flowbite-react";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function PaymentsTable({ payments = [] }: { payments: IPayment[] }) {
    const currencies = (Object.keys(groupBy(payments, (item) => item.currency)) ?? []);

    const [currentPage, setCurrentPage] = useState(1);
    const [currencyFilter, setCurrencyFilter] = useState(currencies);

    let number_of_pages = Math.ceil((payments ?? []).filter((payment) => currencyFilter.includes(payment.currency)).length / PAGE_SIZE)

    const filterChange = (currency: string): void => {
        /// TODO:
        /// Při změně filtru zkontrolovat počet pages a počet vyfiltrovaných itemů
        /// A podle toho uživatele v paginaci přesměrovat, kdyby čísla neseděla
        if (currencyFilter.includes(currency)) {
            setCurrencyFilter(currencyFilter.filter((val) => val !== currency))
        } else {
            setCurrencyFilter([...currencyFilter, currency])
        }
    }

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 ">
                <div className=" mx-auto">
                    <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                        <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-1/2">
                                <form className="flex items-center">
                                    <label htmlFor="simple-search" className="sr-only">Search</label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required />
                                    </div>
                                </form>
                            </div>
                            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                                <div className="flex items-center w-full space-x-3 md:w-auto">
                                    <Dropdown label="Filtry"  >
                                        {currencies.map((item) => {
                                            return (
                                                <Dropdown.Item key={item}>
                                                    <div className="flex items-center">
                                                        <input id="checkbox-item-1" type="checkbox" value={item} checked={currencyFilter.includes(item)} onChange={(currency) => filterChange(currency.target.value)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                        </input>
                                                        <label htmlFor="checkbox-item-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item}</label>
                                                    </div>
                                                </Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Table>
                <Table.Head>
                    <Table.HeadCell>
                        Typ
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Částka
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Měna
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Kdy
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {(payments ?? []).filter((payment) => currencyFilter.includes(payment.currency)).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((payment) => {
                        return (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={payment.timestamp}>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white ">
                                    {payment.type == "IN" ? "Vklad" : "Výběr"}
                                </Table.Cell>
                                <Table.Cell>
                                    {payment.amount.toFixed(2)}
                                </Table.Cell>
                                <Table.Cell>
                                    {payment.currency}
                                </Table.Cell>
                                <Table.Cell>
                                    {new Date(payment.timestamp).toLocaleDateString()} {new Date(payment.timestamp).toLocaleTimeString()}
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
            <Pagination className="flex items-center justify-center text-center"
                currentPage={currentPage}
                nextLabel="Další"
                previousLabel="Zpět"
                totalPages={number_of_pages}
                onPageChange={(page: number) => setCurrentPage(page)}
            />
        </>
    )
}