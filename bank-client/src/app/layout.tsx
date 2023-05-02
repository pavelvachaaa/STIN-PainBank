"use client"
import './globals.css'
import FlowbiteContext from "./context/FlowbiteContext";
import AuthContext from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from './context/ModalContext';
import AccountProvider from './context/AccountContext';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="cs">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>
      <body className="bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <AuthContext>
          <AccountProvider>
            <ModalProvider>
              <ToastContainer
                theme='dark' />
              <FlowbiteContext>
                {children}
              </FlowbiteContext>
            </ModalProvider>
          </AccountProvider>
        </AuthContext>
      </body>
    </html>
  )
}
