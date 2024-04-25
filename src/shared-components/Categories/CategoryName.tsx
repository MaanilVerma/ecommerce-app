import React from "react";
import { CategoryName } from "~/libs/models/categories.model";

const CategoryName: React.FC<CategoryName> = ({
  id,
  name,
  isSaved,
  handleSavedCategories,
}) => {
  return (
    <div className="mx-20 mb-4 flex items-center  max-md:ml-16 max-md:mr-0">
      <input
        type="checkbox"
        value={id}
        id={`selected-${id}`}
        onChange={handleSavedCategories}
        checked={isSaved}
        className={`h-5 w-5 cursor-pointer  ${isSaved ? "accent-black" : ""}`}
      />
      <label
        className="ml-4 cursor-pointer text-base font-normal"
        htmlFor={`selected-${id}`}
      >
        {name}
      </label>
    </div>
  );
};

export default CategoryName;
