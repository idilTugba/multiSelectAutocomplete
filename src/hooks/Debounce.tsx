import React, { useRef } from "react";

function useDebounce<T extends (...arg: any[]) => void>(cb: T, delay = 1000) {
  const timeOutRef = useRef<number | undefined>();

  return (...arg: Parameters<T>) => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = window.setTimeout(() => {
      cb(...arg);
    }, delay);
  };
}

export default useDebounce;
