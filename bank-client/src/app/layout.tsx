"use client"
import './globals.css'
import FlowbiteContext from "./context/FlowbiteContext";
import { ToastContext } from 'flowbite-react/lib/esm/components/Toast/ToastContext';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 z-0">
        <ToastContainer
          theme='dark' />
        <FlowbiteContext>
          {children}
        </FlowbiteContext>
      </body>
    </html>
  )
}
