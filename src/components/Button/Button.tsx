type ReactButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type NewButtonProps = {
  level?: "primary" | "secondary";
  title: string;
  loading?: boolean;
  size?: "regular" | "large";
};

export const Button = ({
  level,
  title,
  size,
  ...params
}: ReactButtonProps & NewButtonProps) => {
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

  return (
    <button
      {...params}
      className={`w-11/12 cursor-pointer rounded-lg ${bgColor} px-8 py-4 text-center ${textColor} lg:mx-5 ${wSize} lg:rounded-2xl ${borderColor}`}
    >
      {title}
    </button>
  );
};
