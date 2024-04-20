import React from "react";
import Button from "~/shared-components/Button";
import { Input, PasswordInput } from "~/shared-components/InputBox";
import TextLink from "~/shared-components/TextLink";

const SignIn: React.FC = () => {
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
        <form className="space-y-8">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter"
            label="Email"
          />

          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter"
            label="Password"
          />
          <Button>LOGIN</Button>
        </form>
        <hr className="mt-8 border-gray-300" />
        <TextLink
          href="/signup"
          regularText="Don't have an account?"
          linkText="SIGN UP"
        />
      </div>
    </div>
  );
};

export default SignIn;
