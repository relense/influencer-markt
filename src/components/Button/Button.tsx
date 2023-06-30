type ReactButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type NewButtonProps = {
  level?: "primary" | "secondary";
  title: string;
  loading?: boolean;
  size?: "regular" | "large";
  shadow?: boolean;
};

export const Button = ({
  level,
  title,
  size,
  shadow,
  ...params
}: ReactButtonProps & NewButtonProps) => {
  let shadowBox = "";
  let bgColor;
  let textColor;
  let borderColor;
  let wSize = "lg:w-auto";

  if (level === "primary") {
    bgColor = "bg-influencer";
    textColor = "text-white";
    borderColor = "";
  } else {
    bgColor = "bg-white";
    textColor = "text-black";
    borderColor = "border-gray3 border-[1px]";
  }

  if (size === "large") {
    wSize = "lg:w-full";
  }

  if (shadow) {
    shadowBox = "m-2 rounded-xl shadow-md shadow-boxShadow";
  }

  return (
    <button
      {...params}
      className={`cursor-pointer rounded-lg ${bgColor} px-8 py-4 text-center font-semibold ${textColor} ${wSize} lg:rounded-2xl ${borderColor} ${shadowBox}`}
    >
      {title}
    </button>
  );
};
