import Image from "next/image";
import PaymentItem from "./paymen_item.component";
import IPayment from "@/types/interfaces";
import { getPayments } from "@/services/payment.service";
import notify from "@/services/notification.service";
import getErrorMessage from "@/utils/error.util";

const payments: IPayment[] = [
    {
        "amount": 100,
        "currency": "CZK",
        "timestamp": 1681743685900,
        "email": "pavel@tul.cz",
        "type": "IN"
    },
    {
        "amount": 17,
        "currency": "CZK",
        "timestamp": 1681753585915,
        "email": "pavel@tul.cz",
        "type": "OUT"
    },
    {
        "amount": 100,
        "currency": "CZK",
        "timestamp": 1681743585972,
        "email": "pavel@tul.cz",
        "type": "OUT"
    }
]

async function getData(): Promise<IPayment[]> {
    let data;
    try {
        data = await getPayments("pavel@tul.cz");
        console.log("Aha:", data);
    } catch (e) {
        console.log(e)
        notify({ message: getErrorMessage(e), type: "error" })
        return payments;
    }

    return data.data;
}


export default async function PaymentsOverview() {
    const data = await getData();
    return (
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Poslední platby</h5>
                <a href="/dashboard/payments" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Celý výpis
                </a>
            </div>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item) => {
                        return <PaymentItem  {...item} ></PaymentItem>
                    })}
                </ul>
            </div>
        </div>
    )
}