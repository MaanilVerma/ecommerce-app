import { userStore } from "../store/user.store";

export const useResetAllStore = () => {
  const clearUser = userStore((state) => state?.clearUser);

  const reset = () => {
    clearUser();
  };

  return reset;
};
