import React, { type AnchorHTMLAttributes } from "react";
import Link from "next/link";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  linkText: string;
  regularText: string;
}

const TextLink: React.FC<TextLinkProps> = ({
  linkText,
  regularText,
  ...linkProps
}) => {
  return (
    <p className="mt-10 text-center text-base font-normal text-[#333333]">
      {regularText}{" "}
      <Link
        {...linkProps}
        href={linkProps.href ?? ""}
        className="ml-2 text-base font-medium leading-6 text-black"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default TextLink;
