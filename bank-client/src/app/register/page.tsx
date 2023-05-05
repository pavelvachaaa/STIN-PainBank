import RegisterForm from "@/components/register/register_form.component";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Registrace"
}

export default async function Register() {
    if (await getServerSession()) {
        return redirect("/dashboard");
    } else
        return <RegisterForm></RegisterForm>
}