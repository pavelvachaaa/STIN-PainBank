import IPayment from "@/types/interfaces";
import Image from "next/image";

export default function PaymentItem({ currency = "CZK", amount = 0, email = "", type = "IN", timestamp = 0 }: IPayment) {
    return (
        <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 ">
                    <Image src={type == "IN" ? "/deposit.svg" : "/withdraw.svg"} alt="deposit" className="w-8 h-8" width={16} height={16}></Image>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {email}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {currency} {amount}
                </div>
            </div>
        </li>
    )
}