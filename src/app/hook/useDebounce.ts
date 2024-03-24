"use client";
import React, { useState, useEffect } from "react";

export default function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
}
