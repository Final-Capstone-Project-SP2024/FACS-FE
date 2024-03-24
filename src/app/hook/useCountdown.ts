"use client";
import React, { useState, useEffect } from "react";

export default function useCountdown() {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timeOut = setTimeout(() => {
      setCountdown((preCountdown) => preCountdown - 1);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [countdown]);

  function start(time: number) {
    setCountdown(time);
  }

  return { countdown, start };
}
