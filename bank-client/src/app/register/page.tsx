import RegisterForm from "@/components/register/register_form.component";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Registrace"
}

export default async function Register() {
    if (await getServerSession()) {
        redirect("/dashboard");
    }
    
    return <RegisterForm></RegisterForm>
}