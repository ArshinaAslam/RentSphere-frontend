// components/ui/AuthClientWrapper.tsx
'use client';

import { clearUser, setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { checkAuthStatus } from "@/utils/auth";
import { useEffect } from "react";

export default function AuthClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      if (rememberMe) {
        try {
          const { isAuthenticated, user } = await checkAuthStatus();
          if (isAuthenticated && user) {
            dispatch(setUser(user));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    };
    
    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
