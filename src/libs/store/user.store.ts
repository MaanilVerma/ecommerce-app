import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserState = {
  user: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  };
};

type UserAction = {
  setUser: (user: UserState["user"]) => void;
  clearUser: () => void;
};

const userData = {
  id: "",
  name: "",
  email: "",
  verified: false,
};

export const userStore = create<UserState & UserAction>()(
  persist(
    (set) => ({
      user: userData,
      setUser: (user) => set(() => ({ user: user })),
      clearUser: () => set(() => ({ user: userData })),
    }),

    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
