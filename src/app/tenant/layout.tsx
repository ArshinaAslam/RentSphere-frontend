// // src/app/(auth)/layout.tsx
// "use client";
// import AuthHeader from "@/components/auth/AuthHeader";

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen bg-[hsl(0,0%,96%)] flex flex-col">
//       <AuthHeader />   
//       <main className="flex-1">{children}</main>
//     </div>
//   );
// }


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // No navbar here
}
