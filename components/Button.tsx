import Image from "next/image";
import { MouseEventHandler } from "react";

type Props = {
  title: string;
  isSubmitting: boolean;
  type?: "button" | "submit";
  leftIcon?: string | null;
  rightIcon?: string | null;
  bgColor?: string;
  textColor?: string;
  handleClick?: MouseEventHandler;
};

export const Button = ({
  title,
  isSubmitting,
  type,
  leftIcon,
  rightIcon,
  bgColor,
  textColor,
  handleClick,
}: Props) => {
  return (
    <button
      type={type || "button"}
      disabled={isSubmitting}
      className={`flexCenter gap-3 px-4 py-3 
      ${textColor || "text-white"}
      ${
        isSubmitting ? "bg-black/50" : bgColor || "bg-primary-purple"
      } } rounded-xl text-sm font-medium max-md:w-full`}
      onClick={handleClick}
    >
      {leftIcon && (
        <Image src={leftIcon} width={14} height={14} alt="left-icon" />
      )}
      {title}
      {rightIcon && (
        <Image src={rightIcon} width={14} height={14} alt="left-icon" />
      )}
    </button>
  );
};
