import Image from 'next/image'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {  
  redirect("/login")
}
