"use client";
import Image from 'next/image';
import React, { useState } from 'react'

export default function SignIn() {
    const [securityCode, setSecurityCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const response = await fetch("/api/v1/User/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    securityCode,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }
        } catch (error) {
            console.error("An unexpected error happened:", error);
        }
        setIsLoggingIn(false);
    }
    return (
        <div className='flex flex-col md:flex-row h-screen items-center'>
            <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                <div className="w-full h-100">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

                    <form className="mt-6" action="#" method="POST">
                        <div>
                            <label className="block text-gray-700">Security Code</label>
                            <input type="text" name="" id="" placeholder="Enter Security Code" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus required />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">Password</label>
                            <input type="password" name="" id="" placeholder="Enter Password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none" required />
                        </div>

                        <div className="text-right mt-2">
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                        </div>

                        <button type="submit" className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
