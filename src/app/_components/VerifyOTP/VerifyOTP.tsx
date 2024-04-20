// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import { api } from "~/trpc/react";

// export function CreatePost() {
//   const router = useRouter();
//   const [name, setName] = useState("");

//   const createPost = api.post.create.useMutation({
//     onSuccess: () => {
//       router.refresh();
//       setName("");
//     },
//   });

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         createPost.mutate({ name });
//       }}
//       className="flex flex-col gap-2"
//     >
//       <input
//         type="text"
//         placeholder="Title"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full rounded-full px-4 py-2 text-black"
//       />
//       <button
//         type="submit"
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
//         disabled={createPost.isPending}
//       >
//         {createPost.isPending ? "Submitting..." : "Submit"}
//       </button>
//     </form>
//   );
// }

import React from "react";
import Button from "~/shared-components/Button";

const MAX_PIN_LENGTH = 8;

interface VerifyOTPProps {
  email: string;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ email }) => {
  const hideEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      const [username, domain] = email.split("@");
      const hiddenUsername =
        (username ?? "").slice(0, 3) + "*".repeat((username ?? "").length - 3);
      return `${hiddenUsername}@${domain}`;
    } else {
      return email;
    }
  };

  return (
    <div className="mx-auto my-12 flex w-[550px]  flex-col items-center rounded-2xl border border-[#C1C1C1] px-3 py-10 max-md:w-full">
      <h2 className="mb-8 text-3xl font-semibold text-black">
        Verify your email
      </h2>
      <p className=" text-base font-normal text-black">
        Enter the 8-digit code you have received on
      </p>
      <p className="mb-11 text-base font-medium text-black">
        {hideEmail(email)}
      </p>
      <form className="flex flex-col  max-md:w-full">
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
              className="h-10 w-10 rounded border-2 border-gray-300"
            >
              <input
                id={`pin_${index}`}
                type="text"
                className="h-full w-full bg-transparent text-center text-xl outline-none"
              />
            </div>
          ))}
        </div>
        <Button className="text-base font-medium uppercase tracking-widest">
          Verify
        </Button>
      </form>
    </div>
  );
};

export default VerifyOTP;
