"use client";
import { useEffect } from "react";
import { API } from "~/libs/config/axios-config";

export default function LoginPage() {
  const fetchCategories = async () => {
    await API.get("/fetchCategoriesById?count=6").then((res) =>
      console.log(res),
    );
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center">Dashboard</main>
  );
}
