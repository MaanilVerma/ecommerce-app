"use client";
import { useEffect } from "react";
import { API } from "~/libs/config/axios-config";

export default function LoginPage() {
  const fetchCategories = async () => {
    await API.get("/fetchCategoriesById?count=6").then((res) =>
      console.log(res),
    );
  };

  async function addInterest() {
    try {
      const response = await API.post("/interests", {
        categoryId: "0a4543da-c721-4400-a121-486b737afbb1",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding interest:", error);
    }
  }

  async function removeInterest() {
    try {
      const response = await API.delete("/interests", {
        data: { categoryId: "5c12c5c8-517c-42df-b2e0-f6179ac6194d" },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error removing interest:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center">
      Dashboard
      <button onClick={addInterest}>ADD</button>
      <button onClick={removeInterest}>REMOVE</button>
    </main>
  );
}
