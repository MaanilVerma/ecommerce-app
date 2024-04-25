import { API } from "~/libs/config/axios-config";
import { toast } from "react-toastify";

export const useInterests = () => {
  const saveInterest = async (id: string) => {
    try {
      await API.post("/interests", {
        categoryId: id,
      });
    } catch (error) {
      console.error("Error adding interest:", error);
    }
  };

  const removeInterest = async (id: string) => {
    try {
      await API.delete("/interests", {
        data: { categoryId: id },
      });
    } catch (error) {
      console.error("Error removing interest:", error);
    }
  };

  return { saveInterest, removeInterest };
};
