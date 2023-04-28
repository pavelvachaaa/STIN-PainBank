"use client"
import { AuthenticateDTO } from "@/services/auth.service";
import notify from "@/services/notification.service";
import getErrorMessage from "@/utils/error.util";
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";


export default function TwoFactorDialog({ auth_request_id, }: { auth_request_id: string }) {
    const router = useRouter()
    const searchParams = useSearchParams();

    const [userData, setUserData] = useState<AuthenticateDTO>({ auth_request_id: auth_request_id, code: undefined });

    const checkVerification = async (userData: AuthenticateDTO) => {
        try {
            const data = await signIn("credentials", {
                redirect: false,
                callbackUrl: `${window.location.origin}/dashboard`,
                ...userData
            });

            if (!data?.ok) {
                throw new Error("Zadali jste neplatný kód")
            } else {
                notify({ type: "success", message: "Úspěšně jsme vás přihlásili" });
                router.push(searchParams?.get("callbackUrl") ?? "/dashboard")
            }
        } catch (error) {
            notify({ type: "error", message: getErrorMessage(error) });
        }
    };

    const updateUserDataHandler = useCallback(
        (type: any) => (event: any) => {
            setUserData({ ...userData, [type]: event.target.value });
        },
        [userData]
    );

    const formHandler = useCallback(
        () => async (event: any) => {
            event.preventDefault();
            await checkVerification(userData);
        },
        [userData]
    );

    return (
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8" >
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Zadejte ověřovací kód
                <p className="text-sm text-gray-500 font-normal">Pokud nemůžete najít e-mail, podívejte se prosím i do spamu</p>

            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={formHandler()}>
                <div>
                    <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ověřovací kód</label>
                    <input value={userData.code ?? ""}
                        onChange={updateUserDataHandler("code")} type="number" name="code" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123456" required />
                </div>
                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ověřit</button>
            </form>
        </div>
    )
}