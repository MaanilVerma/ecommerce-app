import React from "react";
import { useRouter } from "next/navigation";

import { deleteCookie } from "cookies-next";
import { toast } from "react-toastify";

import { TOKEN } from "~/libs/enums/constants";
import { useResetAllStore } from "~/libs/hooks/useResetStore";
import { CategoryDetails } from "~/libs/models/categories.model";
import { useCategories } from "~/libs/hooks/useCategoryData";
import { useInterests } from "~/libs/hooks/useInterests";

import CategoryName from "./CategoryName";
import Pagination from "./Pagination";
import Loader from "../Loader";

const CategoryContainer = () => {
  const router = useRouter();
  const reset = useResetAllStore();
  const {
    categories,
    loading,
    currentPage,
    totalPages,
    userSavedCategoryIds,
    setCurrentPage,
    setUserSavedCategoryIds,
  } = useCategories();

  const { saveInterest, removeInterest } = useInterests();

  const handleLogout = async () => {
    deleteCookie(TOKEN);
    reset();
    router.push("/login");
  };

  const handleCheckboxChange = async (
    categoryId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.target.checked;
    try {
      if (isChecked) {
        setUserSavedCategoryIds((prevCategories: string[]) => [
          ...prevCategories,
          categoryId,
        ]);
        toast.success(`Interest Saved Successfully!`);
        await saveInterest(categoryId);
      } else {
        setUserSavedCategoryIds((prevCategories: string[]) =>
          prevCategories.filter((id: string) => id !== categoryId),
        );
        toast.success("Interest Removed Successfully!");
        await removeInterest(categoryId);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        `There was an issue while ${isChecked ? "adding" : "removing"} interest!`,
      );
    }
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <button
        className="mt-2 inline-flex items-center rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500 "
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="mx-auto my-12 flex min-h-[600px] w-[550px] flex-col rounded-2xl border border-[#C1C1C1] px-3 py-10 max-md:w-full max-md:min-w-full">
        <div className="mx-auto my-6 flex flex-col justify-center">
          <p className="text-center text-3xl font-semibold leading-9 tracking-tight text-gray-900">
            Please mark your interests!
          </p>
          <p className="mt-1 text-center text-base font-normal">
            We will keep you notified
          </p>
          <p className="mt-12 text-center text-xl font-medium">
            My saved interests!
          </p>
          <div className="mt-8 min-h-[328px] content-center text-center">
            {loading ? (
              <>
                <Loader
                  color="dark:fill-black"
                  background="dark:text-gray-200"
                />
                <p className="mt-2 font-semibold text-black ">
                  Fetching Items...
                </p>
              </>
            ) : (
              categories.map((category: CategoryDetails) => (
                <CategoryName
                  key={category?.id}
                  id={category?.id}
                  name={category?.name}
                  isSaved={userSavedCategoryIds?.includes(category?.id)}
                  handleSavedCategories={(e) =>
                    handleCheckboxChange(category.id, e)
                  }
                />
              ))
            )}
          </div>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryContainer;
