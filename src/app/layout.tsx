import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer, Navbar } from './components'
import AuthProvider from '@/context/AuthProvider'
import Sidebar from './components/Sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'
// Toast;
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify'
// import Toast from "./components/Toast";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fire Camera Alarm Solution',
  description: 'Fire Camera Alarm Solution is a web application that helps you to monitor and manage your fire camera alarms.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  console.log(session?.user);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className='flex'>
            {session && session.user ? <Sidebar /> : null}
            <main className={`flex-grow w-full ${session && session.user ? 'ml-56' : ''}`}>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
