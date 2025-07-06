import useProfileData from "@/hooks/useProfileData";
import { Profile } from "@/types";
import { createContext } from "react";
import type { ReactNode } from "react";

const AuthContext = createContext<Profile | null | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { data: profile = null } = useProfileData();

  return <AuthContext.Provider value={profile}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthContextProvider };
