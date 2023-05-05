import { redirect } from 'next/navigation';
import LoginForm from "@/components/login/login_form.component";
import { getServerSession } from "next-auth";

export const metadata = {
    title: "Přihlášení"
}

export default async function Login() {
    if (await getServerSession()) {
        return redirect("/dashboard");
    } else
        return (
            <LoginForm></LoginForm>
        );
}