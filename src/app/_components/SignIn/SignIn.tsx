"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "~/libs/config/axios-config";
import useLoginForm from "~/libs/hooks/useLoginForm";
import Button from "~/shared-components/Button";
import { Input, PasswordInput } from "~/shared-components/InputBox";
import Loader from "~/shared-components/Loader";
import TextLink from "~/shared-components/TextLink";
import { toast } from "react-toastify";
import { userStore } from "~/libs/store/user.store";
import { useResetAllStore } from "~/libs/hooks/useResetStore";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const setUser = userStore((state) => state.setUser);
  const resetStore = useResetAllStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await API.post("/login", data);
      if (response.status === 200) {
        const responseData = response?.data?.data;
        setUser({
          id: responseData?.id,
          name: responseData?.name,
          email: responseData?.email,
          verified: responseData?.verified,
        });
        toast.success(response.data.message);
        setLoading(false);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      switch (err.response.status) {
        case 401:
          toast.error(err.response.data.message);
          break;
        case 403:
          toast.error(err.response.data.message);
          break;
        case 404:
          toast.error(err.response.data.message || "User not found!");
          break;
        default:
          toast.error("Try Again! There was an issue while Logging In.");
      }
    }
  };

  useEffect(() => {
    resetStore();
  }, []);
  return (
    <div className="mx-auto my-12 flex min-h-[600px] w-[550px] flex-col rounded-2xl border border-[#C1C1C1] px-3 py-10 max-md:w-full max-md:min-w-full">
      <div>
        <h2 className="text-center text-3xl  font-semibold text-black">
          Login
        </h2>
        <p className="mt-9 text-center text-2xl font-medium text-black max-md:text-xl">
          Welcome back to ECOMMERCE
        </p>
        <p className="text-center text-base font-normal text-black">
          The next-gen business marketplace
        </p>
      </div>

      <div className="mx-auto mt-10 w-full max-w-sm">
        <form className="space-y-8" onSubmit={handleSubmit(handleLogin)}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter"
            label="Email"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter"
            label="Password"
            error={errors.password?.message}
            {...register("password")}
          />
          {loading ? (
            <Button className="flex items-center justify-center">
              <Loader />
              <span className="ml-3">Logging In</span>
            </Button>
          ) : (
            <Button type="submit">Login</Button>
          )}
        </form>
        <hr className="mt-8 border-gray-300" />
        <TextLink
          href="/"
          regularText="Don't have an account?"
          linkText="SIGN UP"
        />
      </div>
    </div>
  );
};

export default SignIn;
