"use client"
import { StartAuthDTO, startAuth } from "@/services/auth.service";
import notify from "@/services/notification.service";
import getErrorMessage from "@/utils/error.util";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react"
import TwoFactorDialog from "./two_factor_dialog.component";

const initialUserData: StartAuthDTO = {
    email: "",
    password: "",
};

export default function LoginForm() {
    const [hasStartedVerification, setHasStartedVerification] = useState(false);
    const [userData, setUserData] = useState(initialUserData);
    const [authRequestId, setAuthRequestId] = useState("");

    const startVerification = async (userData: StartAuthDTO) => {
        try {
            const res = await startAuth(userData);
            setAuthRequestId((res.data as any).auth_request_id ?? "");
            console.log(res);
            notify({ message: res.message, type: "success" })
            setHasStartedVerification(true);
        } catch (e) {
            notify({ message: getErrorMessage(e), type: "error" })
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
            await startVerification(userData);
        },
        [userData]
    );



    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    PainBank
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    {hasStartedVerification ? <TwoFactorDialog auth_request_id={authRequestId ?? ""}></TwoFactorDialog> : <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Přihlašte se k Vašemu účtu
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={formHandler()}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Váš e-mail</label>
                                <input value={userData.email}
                                    onChange={updateUserDataHandler("email")} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Heslo</label>
                                <input value={userData.password}
                                    onChange={updateUserDataHandler("password")} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Zapamatuj si mě</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Přihlásit se</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Nemáte ještě účet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Vytvořte si ho u nás</a>
                            </p>
                        </form>
                    </div>}
                </div>
            </div>
        </section>
    );
}