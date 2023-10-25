import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt";
import "dayjs/locale/en";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

export const useWindowWidth = () => {
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return width;
};

const formatNumber = (value: number) => {
  if (value) {
    return value.toLocaleString();
  } else {
    return "";
  }
};

const formatNumberWithDecimalValue = (value: number) => {
  if (value) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return (0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

const formatFullDateWithTime = (
  date: Date | number,
  locale: string
): string => {
  return dayjs(date).locale(locale).format("DD MMMM YYYY - HH:mm ");
};

const formatOnlyDate = (date: Date | number, locale: string): string => {
  return dayjs(date).locale(locale).format("DD/MM/YYYY");
};

const formatShowtime = (date: Date | number, locale: string): string => {
  return dayjs(date).locale(locale).format("HH:mm ");
};

const formatNumberWithKorM = (number: number) => {
  if (Math.abs(number) >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (Math.abs(number) >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export interface PreloadedImage {
  id: number;
  url: string;
  width: number;
  height: number;
}

const preloadImages = async (
  imageUrls: { id: number; url: string }[]
): Promise<PreloadedImage[]> => {
  const imagePromises = imageUrls.map(
    (image) =>
      new Promise<PreloadedImage>((resolve, reject) => {
        const img = new Image();
        img.src = image.url;
        img.onload = () =>
          resolve({
            id: image.id,
            url: image.url,
            width: img.width,
            height: img.height,
          });
        img.onerror = (error) => reject(error);
      })
  );

  try {
    const images = await Promise.all(imagePromises);
    return images;
  } catch (error) {
    console.error("Error preloading images:", error);
    return [];
  }
};

const calculerMonetaryValue = (value: number) => {
  const result = Number(
    (Math.round((value / 100.0) * 100) / 100).toFixed(2)
  ).toLocaleString(undefined, { minimumFractionDigits: 2 });
  return result;
};

const calculateMonetaryValueInCents = (paymentAmount: number) => {
  return paymentAmount * 100; // Amount in cents (EUR)
};

const calculateServiceFee = () => {
  return 0.15;
};

const useEffectOnlyOnce = (fn: () => any) => {
  const ref = useRef(false);
  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      fn();
    }
  }, [fn]);
};

export const helper = {
  formatNumber,
  formatNumberWithDecimalValue,
  formatDate,
  formatOnlyDate,
  formatFullDateWithTime,
  formatShowtime,
  formatNumberWithKorM,
  preloadImages,
  calculateServiceFee,
  calculerMonetaryValue,
  calculateMonetaryValueInCents,
  useEffectOnlyOnce,
};
