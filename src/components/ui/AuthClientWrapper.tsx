

// 'use client';

// import { useAppDispatch } from "@/store/hooks";
// import { fetchCurrentUserAsync } from "@/features/auth/authThunks";
// import { useEffect } from "react";

// export default function AuthClientWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useAppDispatch();

//   useEffect(() => {

//     dispatch(fetchCurrentUserAsync());
//   }, [dispatch]);

//   return <>{children}</>;
// }
