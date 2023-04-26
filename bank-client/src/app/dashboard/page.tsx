import Header from "@/components/header/header.component"
import PaymentsOverview from "@/components/payments/payments_overview.component"
import SidebarMenu from "@/components/sidebar/sidebar.component"

export const metadata = {
    title: "Dashboard"
}

export default async function DashboardPage() {

    return (
        <>

            <Header></Header>
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <PaymentsOverview></PaymentsOverview>
            </div>


        </>
    )
}

