import AccountsOverview from "@/components/accounts/accounts_overview.component"
import Header from "@/components/header/header.component"
import PaymentsOverview from "@/components/payments/payments_overview.component"

export const metadata = {
    title: "Dashboard"
}

export default async function DashboardPage() {

    return (
        <>

            <Header></Header>
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 lg:gap-8 lg:p-8 md:p-6">
                {/* @ts-expect-error Server Component */}
                <PaymentsOverview></PaymentsOverview>
                <AccountsOverview></AccountsOverview>

            </div >






        </>
    )
}

