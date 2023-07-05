import { useEffect, useRef } from "react";

export const useOutsideClick = (
  callback: (T?: unknown) => void,
  ref: React.RefObject<HTMLDivElement>
) => {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(<HTMLElement>e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const formatNumber = (value: number) => {
  if (value) {
    return value.toLocaleString();
  } else {
    return "";
  }
};

export const helper = {
  formatNumber,
};
