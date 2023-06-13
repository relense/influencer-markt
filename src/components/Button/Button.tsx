type ReactButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type NewButtonProps = {
  level?: "primary" | "secondary";
  title: string;
  loading?: boolean;
};

export const Button = ({
  level,
  title,
  ...params
}: ReactButtonProps & NewButtonProps) => {
  let bgColor;
  let textColor;
  let borderColor;

  if (level === "primary") {
    bgColor = "bg-influencer";
    textColor = "text-white";
    borderColor = "";
  } else {
    bgColor = "bg-white";
    textColor = "text-black";
    borderColor = "border-gray3 border-[1px]";
  }

  return (
    <button
      {...params}
      className={`w-11/12 cursor-pointer rounded-lg ${bgColor} px-8 py-4 text-center ${textColor} lg:mx-5 lg:w-auto lg:rounded-2xl ${borderColor}`}
    >
      {title}
    </button>
  );
};
