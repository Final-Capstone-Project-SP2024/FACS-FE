import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer, Navbar } from './components'
import AuthProvider from '@/context/AuthProvider'
import Sidebar from './components/Sidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/options'

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
        <div>
          <AuthProvider>
            <Navbar />
            <div className='flex'>
              {session && session.user ? <Sidebar /> : null}
              <main className='flex-grow w-full'>{children}</main>
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
