import { format, type Locale } from "date-fns";
import { enGB, pt } from "date-fns/locale";

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

const formatDate = (date: Date | number): string => {
  const locales: Record<string, Locale> = { enGB, pt };

  return format(date, "dd MMMM yyyy");
};

export const helper = {
  formatNumber,
  formatDate,
};
