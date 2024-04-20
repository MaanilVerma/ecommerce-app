import React, { useState, forwardRef } from "react";
import classNames from "classnames";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  customClassName?: string;
  error?: string;
  label?: string;
}

const DEFAULT_CLASSNAMES =
  "w-full mt-2 rounded-md border-r border-t border-l border-b px-4 py-2 min-h-12 text-sm leading-6 text-black placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-5";

const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ customClassName, error, label, ...rest }, ref) => {
    return (
      <div className="mt-2">
        {label && (
          <label
            htmlFor={rest?.id}
            className="text-base font-normal leading-6 text-black"
          >
            {label}
          </label>
        )}
        <input
          className={classNames(DEFAULT_CLASSNAMES, customClassName)}
          ref={ref}
          {...rest}
        />
        {error && <p className="p-2 pb-0 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ customClassName, error, label, ...rest }, ref) => {
    const [passwordShown, setPasswordShown] = useState(false);

    return (
      <div className="mt-2">
        {label && (
          <label
            htmlFor={rest?.id}
            className="text-base font-normal leading-6 text-black"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            className={classNames(DEFAULT_CLASSNAMES, customClassName)}
            ref={ref}
            {...rest}
            type={passwordShown ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 p-2 text-sm font-medium underline hover:text-gray-500"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="p-2 pb-0 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

const MemoizedBaseInput = React.memo(BaseInput);
const MemoizedPasswordInput = React.memo(PasswordInput);

export { MemoizedBaseInput as Input, MemoizedPasswordInput as PasswordInput };
