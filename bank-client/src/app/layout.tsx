"use client"
import './globals.css'
import FlowbiteContext from "./context/FlowbiteContext";
import AuthContext from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from './context/ModalContext';
import AccountProvider from './context/AccountContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="cs">
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
