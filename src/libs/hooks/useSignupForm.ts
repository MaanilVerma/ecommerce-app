import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { type TypeOf, z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .trim()
    .refine((value) => /^[a-zA-Z ]+$/.test(value), "Please Enter a Valid Name"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please Enter a Valid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/i, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    ),
});

type FormData = TypeOf<typeof schema>;

const useSignupForm = (props?: UseFormProps<FormData>) => {
  return useForm<FormData>({
    resolver: zodResolver(schema),
    ...props,
  });
};

export default useSignupForm;
