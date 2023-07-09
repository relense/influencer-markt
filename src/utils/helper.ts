import dayjs from "dayjs";
import "dayjs/locale/pt";
import "dayjs/locale/en";

import { useEffect, useRef } from "react";
import { Option } from "../components/CustomMultiSelect";

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

const formatDate = (date: Date | number, locale: string): string => {
  return dayjs(date).locale(locale).format("DD MMMM YYYY");
};

export const helper = {
  formatNumber,
  formatDate,
};
