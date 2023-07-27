import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt";
import "dayjs/locale/en";

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

const formatDate = (date: Date | number, locale: string): string => {
  dayjs.extend(relativeTime);

  if (dayjs(date).isSame(new Date(), "day")) {
    return dayjs(date).locale(locale).fromNow();
  } else {
    return dayjs(date).locale(locale).format("DD MMMM YYYY");
  }
};

const formatNumberWithKorM = (number: number) => {
  if (Math.abs(number) >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (Math.abs(number) >= 1e3) {
    return (number / 1e3).toFixed(1) + "k";
  } else {
    return number.toString();
  }
};

export const helper = {
  formatNumber,
  formatDate,
  formatNumberWithKorM,
};
