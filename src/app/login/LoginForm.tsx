"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@material-tailwind/react";
function LoginForm() {
  const [securityCode, setSecurityCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    console.log("a");
    try {
      const res = await signIn("credentials", {
        securityCode,
        password,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input onChange={(e) => setSecurityCode(e.target.value)} />
      <input onChange={(e) => setPassword(e.target.value)} />
      {/* <Button>Button</Button>; */}
      <button className="border-black border-2" onClick={handleLogin}>
        login
      </button>
    </div>
  );
}

export default LoginForm;
