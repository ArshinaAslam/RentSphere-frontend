// // components/ui/AuthClientWrapper.tsx
// 'use client';

// import { clearUser, setUser } from "@/features/auth/authSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { checkAuthStatus } from "@/utils/auth";
// import { useEffect } from "react";
// // import GlobalSpinner from "@/components/common/GlobalSpinner";

// export default function AuthClientWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useAppDispatch();
//   const { loading } = useAppSelector(state => state.auth);
//   useEffect(() => {
//     const initAuth = async () => {
//       const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
//       if (rememberMe) {
//         try {
//           const { isAuthenticated, user } = await checkAuthStatus();
//           if (isAuthenticated && user) {
//             dispatch(setUser(user));
//           } else {
//             dispatch(clearUser());
//           }
//         } catch (error) {
//           dispatch(clearUser());
//         }
//       } else {
//         dispatch(clearUser());
//       }
//     };
    
//     initAuth();
//   }, [dispatch]);



  


//   return <>
//   {children}
  
//   </>;
// }



'use client';

import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUserAsync } from "@/features/auth/authThunks";
import { useEffect } from "react";

export default function AuthClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    
    dispatch(fetchCurrentUserAsync());
  }, [dispatch]);

  return <>{children}</>;
}
