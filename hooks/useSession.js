import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser, signOut as apiSignOut } from "../lib/api";

// Session status types
export const SessionStatus = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

/**
 * useSession hook - Single source of truth for authentication state
 * 
 * @returns {{
 *   user: object | null,
 *   status: 'loading' | 'authenticated' | 'unauthenticated',
 *   isLoading: boolean,
 *   isAuthenticated: boolean,
 *   refresh: () => Promise<void>,
 *   signOut: () => Promise<void>,
 * }}
 */
export function useSession() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(SessionStatus.LOADING);

  // Check for existing session on mount
  const checkSession = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        setStatus(SessionStatus.UNAUTHENTICATED);
        setUser(null);
        return;
      }

      // Fetch current user if token exists
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStatus(SessionStatus.AUTHENTICATED);
      } else {
        // Token exists but user fetch failed - clear token
        await AsyncStorage.removeItem("auth_token");
        setStatus(SessionStatus.UNAUTHENTICATED);
        setUser(null);
      }
    } catch (error) {
      console.error("Session check error:", error);
      // On error, assume unauthenticated
      setStatus(SessionStatus.UNAUTHENTICATED);
      setUser(null);
    }
  }, []);

  // Initial session check
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Refresh session (call after sign-in/sign-up)
  const refresh = useCallback(async () => {
    setStatus(SessionStatus.LOADING);
    await checkSession();
  }, [checkSession]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await apiSignOut();
      setUser(null);
      setStatus(SessionStatus.UNAUTHENTICATED);
    } catch (error) {
      console.error("Sign out error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      setStatus(SessionStatus.UNAUTHENTICATED);
    }
  }, []);

  return {
    user,
    status,
    isLoading: status === SessionStatus.LOADING,
    isAuthenticated: status === SessionStatus.AUTHENTICATED,
    refresh,
    signOut,
  };
}


