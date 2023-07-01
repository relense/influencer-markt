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
  disabled?: boolean;
};

export const Button = ({
  level,
  title,
  size,
  shadow,
  disabled,
  ...params
}: ReactButtonProps & NewButtonProps) => {
  let classes = "";
  let shadowBox = "";
  let bgColor = "";
  let textColor = "";
  let borderColor = "";
  let wSize = "lg:w-auto";
  let cursor = "cursor-pointer";
  let hover = "hover:bg-influencer-dark";

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

  if (disabled) {
    bgColor = "bg-influencer-light";
    cursor = "cursor-not-allowed";
    hover = "";
  }

  classes = `${cursor} rounded-lg ${bgColor} px-8 py-4 text-center font-semibold ${textColor} ${wSize} lg:rounded-2xl ${borderColor} ${shadowBox} ${hover}`;

  return (
    <button {...params} className={classes}>
      {title}
    </button>
  );
};
