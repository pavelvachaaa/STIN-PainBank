
import Header from "@/components/header/header.component"
import PaymentsTable from "@/components/payments/payments_table.component"

export const metadata = {
    title: "Payments"
}

export default function PaymentsPage() {
    return (
        <>
            <Header></Header>
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl ">
                <PaymentsTable></PaymentsTable>
            </div>
        </>
    )
}

