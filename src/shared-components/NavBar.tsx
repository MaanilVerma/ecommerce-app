import React from "react";
import { CartIcon } from "~/assets/CartIcon";
import { LeftArrow } from "~/assets/LeftArrow";
import { RightArrow } from "~/assets/RightArrow";
import { SearchIcon } from "~/assets/SearchIcon";

import { innerMenu, upperMenu } from "~/utils/constants";

const NavBar: React.FC = () => {
  return (
    <>
      <div className="mx-10 flex h-9 items-center justify-end space-x-4">
        {upperMenu?.map((item) => (
          <p className="cursor-pointer text-sm font-normal" key={item}>
            {item}
          </p>
        ))}
      </div>
      <div className="mx-10 flex h-16 items-center justify-between">
        <div className="text-2xl font-bold md:text-3xl">ECOMMERCE</div>

        <div className=" flex gap-8  max-lg:hidden">
          {innerMenu?.map((menuItems) => (
            <p
              key={menuItems}
              className="cursor-pointer text-base font-semibold"
            >
              {menuItems}
            </p>
          ))}
        </div>

        <div className="ml-16 flex space-x-8">
          <SearchIcon />
          <CartIcon />
        </div>
      </div>
      <div className="flex h-9 items-center justify-center gap-6 bg-[#F4F4F4] font-medium">
        <LeftArrow />
        <p className="text-sm font-medium">Get 10% off on business sign up</p>
        <RightArrow />
      </div>
    </>
  );
};

export default NavBar;
