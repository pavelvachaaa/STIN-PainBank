import Header from "@/components/header/header.component"
import PaymentsTable from "@/components/payments/payments_table.component"
import { getPayments } from "@/services/payment.service";
import IPayment from "@/types/interfaces";
import { getServerSession } from "next-auth";

export const metadata = {
    title: "Payments"
}

async function getData(): Promise<IPayment[]> {
    const session = await getServerSession()

    let data;
    try {
        data = await getPayments(session?.user?.email ?? "");
    } catch (e) {
        return [];
    }

    return data.data;
}

export default async function PaymentsPage() {
    const data = await getData();
    return (
        <>
            <Header></Header>
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl ">
                <PaymentsTable payments={[...data]}></PaymentsTable>
            </div>
        </>
    )
}

