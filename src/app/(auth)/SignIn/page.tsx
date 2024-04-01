import React from 'react'
import SignIn from './components/SignIn'
import SignInLayout from '../layout'

export default function page() {
  return (
    <SignInLayout>
      <div className="flex items-center w-full">
        <SignIn />
      </div>
    </SignInLayout>
  )
}
