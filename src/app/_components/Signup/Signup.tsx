"use client";

import React, { useState } from "react";
import { Slide, toast } from "react-toastify";
import Button from "~/shared-components/Button";
import { Input, PasswordInput } from "~/shared-components/InputBox";
import TextLink from "~/shared-components/TextLink";
import { API } from "~/libs/config/axios-config";
import useSignupForm from "~/libs/hooks/useSignupForm";
import Loader from "~/shared-components/Loader";
import VerifyOTP from "../VerifyOTP/VerifyOTP";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(true);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useSignupForm();

  let loadingToast: any;

  const handleSignup = async () => {
    const { name, email, password } = getValues();

    try {
      setLoading(true);
      loadingToast = toast.loading("Sending OTP via Email...", {
        autoClose: false,
        transition: Slide,
        theme: "colored",
      });
      loadingToast;
      const response = await API.post(`/signup`, {
        name,
        email,
        password,
      });

      setLoading(false);

      switch (response.status) {
        case 200:
          toast.update(loadingToast, {
            render: `${response.data.message}`,
            type: "success",
            isLoading: false,
            autoClose: 5000,
            transition: Slide,
            closeOnClick: true,
          });
          setShowSignup(false);

          break;
      }
    } catch (err: any) {
      setLoading(false);
      switch (err.response.status) {
        case 400:
          toast.update(loadingToast, {
            render: `${err.response.data.message}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            transition: Slide,
            closeOnClick: true,
          });

          break;
        case 409:
          toast.update(loadingToast, {
            render: `${err.response.data.message}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            transition: Slide,
            closeOnClick: true,
            theme: "colored",
          });
          break;
        default:
          toast.update(loadingToast, {
            render:
              "Try Again. There was an issue while creating your account.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            transition: Slide,
            closeOnClick: true,
            theme: "colored",
          });
      }
    }
  };

  return (
    <>
      {showSignup ? (
        <div className="mx-auto my-12 flex min-h-[600px] min-w-[550px] flex-col rounded-2xl border border-[#C1C1C1]  px-3 py-10 max-md:w-full max-md:min-w-full">
          <h2 className="text-center text-3xl font-semibold text-black">
            Create your account
          </h2>

          <div className="mx-auto mt-10 w-full max-w-sm">
            <form className="space-y-8" onSubmit={handleSubmit(handleSignup)}>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Enter your name"
                label="Name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[a-zA-Z ]*$/,
                    message: "Please Enter a Valid Name",
                  },
                })}
              />
              <Input
                id="email"
                type="text"
                autoComplete="email"
                placeholder="Enter your email"
                label="Email"
                error={errors.email?.message}
                {...register("email")}
              />
              <PasswordInput
                id="password"
                autoComplete="new-password"
                placeholder="Add a password"
                label="Password"
                error={errors.password?.message}
                {...register("password")}
              />

              {loading ? (
                <Button className="flex items-center justify-center">
                  <Loader />
                  <span className="ml-3">Creating Account</span>
                </Button>
              ) : (
                <Button type="submit">Create Account</Button>
              )}
            </form>

            <TextLink
              href="/login"
              regularText="Have an account?"
              linkText="LOGIN"
            />
          </div>
        </div>
      ) : (
        <VerifyOTP email={getValues()?.email || ""} />
      )}
    </>
  );
};

export default Signup;
