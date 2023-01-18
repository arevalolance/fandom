import { Dispatch, SetStateAction } from "react";

const PopoverItem = ({
  onClick,
  value,
}: {
  onClick: Dispatch<SetStateAction<string>>;
  value: string;
}) => {
  return (
    <button
      onClick={() => onClick(value)}
      className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
    >
      {value}
    </button>
  );
};

export default PopoverItem;
