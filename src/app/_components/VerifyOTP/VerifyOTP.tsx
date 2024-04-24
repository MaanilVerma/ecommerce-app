"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { API } from "~/libs/config/axios-config";
import { hideEmail } from "~/libs/utils/utils";
import Button from "~/shared-components/Button";
import Loader from "~/shared-components/Loader";

const MAX_PIN_LENGTH = 6;

const VerifyOTP: React.FC<{ email: string }> = ({ email }) => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(
    Array.from({ length: MAX_PIN_LENGTH }, () => ""),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array.from({ length: MAX_PIN_LENGTH }, () => null),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (index: number, value: string) => {
    if (value === "" || !isNaN(Number(value))) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (
        value !== "" &&
        index < MAX_PIN_LENGTH - 1 &&
        inputRefs.current[index + 1]
      ) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && index > 0 && pin[index] === "") {
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text");
    if (/^\d+$/.test(pastedData) && pastedData.length <= MAX_PIN_LENGTH) {
      const newPin = [...pin];
      for (let i = 0; i < pastedData.length; i++) {
        newPin[i] = pastedData.charAt(i);
      }
      setPin(newPin);
    }
  };
  console.log(pin);
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (pin.some((digit) => digit === "")) {
      setError("Please fill in all digits of the OTP");
      setLoading(false);
      return;
    }

    setError("");
    try {
      const otp = pin.join("");
      const response = await API.post("/verify", { email, otp });
      if (response.status === 200) {
        toast.success(response.data.message);
        setLoading(false);
        router.push("/login");
      }
    } catch (err: any) {
      switch (err.response.status) {
        case 401:
          toast.error(err.response.data.message);
          break;
        default:
          toast.error(
            "There was an error while verifying OTP. Please Try Again.",
          );
      }
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-12 flex w-[550px]  flex-col items-center rounded-2xl border border-[#C1C1C1] px-3 py-10 max-md:w-full">
      <h2 className="mb-8 text-3xl font-semibold text-black">
        Verify your email
      </h2>
      <p className=" text-base font-normal text-black">
        Enter the 6-digit code you have received on
      </p>
      <p className="mb-11 text-base font-medium text-black">
        {hideEmail(email)}
      </p>
      <form className="flex flex-col max-md:w-full" onSubmit={handleVerify}>
        <label
          htmlFor="pin_0"
          className="font-regular mb-2 text-base leading-6 text-black"
        >
          Code
        </label>
        <div className="mb-16 flex space-x-2">
          {Array.from({ length: MAX_PIN_LENGTH }).map((_, index) => (
            <div
              key={index}
              className={`h-10 w-10 rounded border-2 transition-all duration-300 ease-in-out ${pin[index] ? "border-black" : "border-gray-300"}`}
            >
              <input
                // @ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                id={`pin_${index}`}
                type="text"
                maxLength={1}
                className="h-full w-full bg-transparent text-center text-xl outline-none"
                value={pin[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                onPaste={handlePaste}
                autoComplete="off"
                required
              />
              {error && (
                <p className="p-2 pb-0 text-sm text-red-500">{error}</p>
              )}
            </div>
          ))}
        </div>
        <Button className="text-base font-medium uppercase tracking-widest">
          {loading ? <Loader /> : "Verify"}
        </Button>
      </form>
    </div>
  );
};

export default VerifyOTP;
