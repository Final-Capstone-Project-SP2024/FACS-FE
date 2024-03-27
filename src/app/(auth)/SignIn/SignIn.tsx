"use client";
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import login from '../../../../public/login-img.jpeg';

export default function SignIn() {
    const [securityCode, setSecurityCode] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            const res = await signIn("credentials", {
                securityCode,
                password,
                redirect: true,
                callbackUrl: "/",
            });
            console.log(res);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col md:flex-row h-screen items-center justify-center'>
            <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                <Image src={login} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
                <div className="w-full h-100">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

                    <form className="mt-6" onSubmit={(e) => handleSignin(e)}>
                        <div>
                            <label htmlFor="securityCode" className="block text-gray-700">Security Code</label>
                            <input 
                                type="text" 
                                id="securityCode" 
                                placeholder="Enter Security Code" 
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" 
                                autoFocus 
                                required 
                                // value={securityCode} 
                                onChange={(e) => setSecurityCode(e.target.value)}
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Enter Password" 
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" 
                                required 
                                // value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="text-right mt-2">
                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Forgot Password?</a>
                        </div>

                        <button className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
