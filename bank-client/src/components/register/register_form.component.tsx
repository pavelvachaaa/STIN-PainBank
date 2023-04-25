"use client";
import notify from "@/services/notification.service";
import { CreateAccountDTO, register } from "@/services/auth.service";
import getErrorMessage from "@/utils/error.util";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';


const initialUserData: CreateAccountDTO = {
    name: "",
    email: "",
    password: "",
};

export default function RegisterForm() {
    const router = useRouter()

    const [userData, setUserData] = useState(initialUserData);
    const updateUserDataHandler = useCallback(
        (type: any) => (event: any) => {
            setUserData({ ...userData, [type]: event.target.value });
        },
        [userData]
    );

    const formHandler = useCallback(
        () => async (event: any) => {
            event.preventDefault();
            try {
                const res = await register(userData);
                notify({ message: res.message, type: "success" })
                router.push('/login')
            } catch (e) {
                notify({ message: getErrorMessage(e), type: "error" })
            }

        },
        [userData]
    );

    return (
        <>

            <section className="bg-gray-50 dark:bg-gray-900">

                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                        PainBank
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Založit účet
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={formHandler()}>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Váše jméno</label>
                                    <input value={userData.name}
                                        onChange={updateUserDataHandler("name")} type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Váš e-mail</label>
                                    <input value={userData.email}
                                        onChange={updateUserDataHandler("email")} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Heslo</label>
                                    <input value={userData.password}
                                        onChange={updateUserDataHandler("password")} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                {/* <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Potvrďte heslo</label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div> */}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" required aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">Souhlasím s <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">pravidly a podmínkami užití</a></label>
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Založit účet</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Máte již účet? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Přihlašte se</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}