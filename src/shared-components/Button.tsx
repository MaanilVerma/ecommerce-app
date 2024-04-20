import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...buttonProps }) => {
  return (
    <button
      {...buttonProps}
      className={`h-14 w-full rounded-md bg-black text-base font-semibold leading-6 text-white hover:bg-gray-700 ${buttonProps.className}`}
    >
      {children}
    </button>
  );
};

export default Button;
