import { redirect } from 'next/navigation'

export default function Home() {
  console.log(process.env.NEXTAUTH_URL)
  redirect("/login")
}
