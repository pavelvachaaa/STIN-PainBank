"use client"
import './globals.css'
import FlowbiteContext from "./context/FlowbiteContext";
import AuthContext from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="cs">
      <body className="bg-gray-50 dark:bg-gray-900 ">
        <AuthContext>
          <ToastContainer
            theme='dark' />
          <FlowbiteContext>
            {children}
          </FlowbiteContext>
        </AuthContext>
      </body>
    </html>
  )
}
