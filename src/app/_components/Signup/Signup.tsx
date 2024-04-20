"use client";

import React, { useState } from "react";
import Button from "~/shared-components/Button";
import { Input, PasswordInput } from "~/shared-components/InputBox";
import TextLink from "~/shared-components/TextLink";
import { API } from "~/utils/axios-config";

const Signup: React.FC = () => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  async function handleSignup(
    name: string,
    email: string,
    password: string,
    event: any,
  ) {
    event.preventDefault();
    try {
      const response = await API.post(`/signup`, {
        name: name,
        email: email,
        password: password,
      });
      if (response.data.error || response.status !== 200) throw new Error();
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="mx-auto my-12 flex min-h-[600px] min-w-[550px] flex-col rounded-2xl border border-[#C1C1C1]  px-3 py-10 max-md:w-full max-md:min-w-full">
        <h2 className="text-center text-3xl font-semibold text-black">
          Create your account
        </h2>

        <div className="mx-auto mt-10 w-full max-w-sm">
          <form className="space-y-8">
            <Input
              id="name"
              autoComplete="name"
              placeholder="Enter your name"
              label="Name"
              onChange={(e) => setFirst(e.target.value)}
              value={first}
            />
            <Input
              id="email"
              type="text"
              autoComplete="email"
              placeholder="Enter your email"
              label="Email"
              onChange={(e) => setSecond(e.target.value)}
              value={second}
            />
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Add a password"
              label="Password"
              onChange={(e) => setThird(e.target.value)}
              value={third}
            />

            <Button
              className="mt-10 text-base font-medium"
              onClick={(e) => handleSignup(first, second, third, e)}
            >
              CREATE ACCOUNT
            </Button>
          </form>

          <TextLink href="/" regularText="Have an account?" linkText="LOGIN" />
        </div>
      </div>
    </>
  );
};

export default Signup;
