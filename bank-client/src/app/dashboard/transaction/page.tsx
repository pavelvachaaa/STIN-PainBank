import AccountsOverview from "@/components/accounts/accounts_overview.component"
import Header from "@/components/header/header.component"
import MakeTransactionForm from "@/components/payments/make_transaction.component"
import PaymentsOverview from "@/components/payments/payments_overview.component"

export const metadata = {
    title: "Transakce"
}

export default async function TransactionPage() {

    return (
        <>

            <Header></Header>
            <MakeTransactionForm open={true}></MakeTransactionForm>



        </>
    )
}

