import { useState, useEffect } from "react";
import { API } from "~/libs/config/axios-config";
import { CATEGORIES_PER_PAGE } from "~/libs/enums/constants";
import { toast } from "react-toastify";
import { CategoryDetails } from "../models/categories.model";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [userSavedCategoryIds, setUserSavedCategoryIds] = useState<string[]>(
    [],
  );

  const fetchCategoryData = async (page: number) => {
    setLoading(true);
    try {
      await API.get(
        `/fetchCategoriesById?limit=${CATEGORIES_PER_PAGE}&offset=${page * CATEGORIES_PER_PAGE}`,
      ).then((res) => {
        const responseData = res.data;
        setCategories(responseData?.categories);
        setTotalPages(responseData?.pageCount);
        setUserSavedCategoryIds(
          responseData?.userLikedCategories?.map(
            (category: CategoryDetails) => category?.id,
          ),
        );
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("There was an issue while fetching categories!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData(currentPage);
  }, [currentPage]);

  return {
    categories,
    loading,
    currentPage,
    totalPages,
    userSavedCategoryIds,
    setCurrentPage,
    setUserSavedCategoryIds,
  };
};
