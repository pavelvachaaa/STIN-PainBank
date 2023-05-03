import PaymentItem from "./paymen_item.component";
import IPayment from "@/types/interfaces";
import { getPayments } from "@/services/payment.service";
import { getServerSession } from "next-auth";


async function getData(): Promise<IPayment[]> {
    const session = await getServerSession();
    let data;
    try {
        data = await getPayments(session?.user?.email ?? "");
    } catch (e) {
        return [];
    }

    return data.data;
}

export default async function PaymentsOverview() {
    const data = await getData();

    return (
        <div className="w-full p-4  max-w-screen-md bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Poslední platby <p className="text-sm text-gray-500 font-normal pt-1">Zobrazujeme 5 posledních výsledků</p> </h5>
                <a href="/dashboard/payments" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    Celý výpis
                </a>
            </div>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.slice(0, 5).map((item) => {
                        return <PaymentItem  {...item} key={item.timestamp} ></PaymentItem>
                    })}
                </ul>
            </div>
        </div>
    )
}