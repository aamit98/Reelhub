import React, { createContext, useContext } from "react";
import { useSession } from "../hooks/useSession";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const session = useSession();

  // Provide backward-compatible API for existing components
  return (
    <GlobalContext.Provider
      value={{
        // Backward compatibility
        isLogged: session.isAuthenticated,
        setIsLogged: () => {
          console.warn("setIsLogged is deprecated. Use session.refresh() instead.");
        },
        user: session.user,
        setUser: () => {
          console.warn("setUser is deprecated. Use session.refresh() instead.");
        },
        loading: session.isLoading,
        // New session API
        session,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;


