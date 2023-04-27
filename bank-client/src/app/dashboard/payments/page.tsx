import Header from "@/components/header/header.component"


export const metadata = {
    title: "Payments"
}

export default async function PaymentsPage() {

    return (
        <>

            <Header></Header>
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                Zde bude tabulka
            </div>


        </>
    )
}

