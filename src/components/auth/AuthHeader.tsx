




// 'use client';

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { 
//   Home, 
//   MessageCircle, 
//   Bell, 
//   User, 
//   LogOut, 
//   Settings,
//   UserCircle 
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { usePathname } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { logoutAsync} from "@/features/auth/authThunks";
// import { useRouter } from "next/navigation";
// import { clearUser } from "@/features/auth/authSlice";

// interface AuthHeaderProps {
//   isAuthPage?: boolean;
//   authAction?: 'login' | 'signup' | 'resetPassword';
// }

// export default function AuthHeader({ 
//   isAuthPage = false, 
//   authAction = 'signup' 
// }: AuthHeaderProps) {
//   const pathname = usePathname();
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const { userData } = useAppSelector(state => state.auth);
//   const isLoggedIn = !!userData;
//   const isDashboard = pathname.startsWith('/tenant/dashboard') || pathname.startsWith('/landlord/dashboard');

//   // ✅ LOGGED IN DASHBOARD HEADER
//   if (isLoggedIn || isDashboard) {
//     return (
//       <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
//         {/* Logo */}
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
//             <Home className="w-5 h-5 text-white stroke-[2.5]" />
//           </div>
//           <span className="text-slate-900 font-bold text-xl tracking-tight hidden md:block">
//             RentSphere
//           </span>
//         </div>

//         {/* Right side: Notifications + Profile Dropdown */}
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-slate-100">
//             <MessageCircle className="w-5 h-5 text-slate-600" />
//           </Button>
//           <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-slate-100">
//             <Bell className="w-5 h-5 text-slate-600" />
//           </Button>

//           {/* ✅ USER PROFILE DROPDOWN */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-slate-100">
//                 <Avatar className="h-9 w-9">
//                   {/* <AvatarImage src={userData?.avatar || ''} /> */}
//                   <AvatarFallback className="bg-emerald-600 text-white">
//                     {userData?.firstName?.[0] || 'U'}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end">
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">
//                     {userData?.firstName}
//                   </p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {userData?.email}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="cursor-pointer">
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 className="cursor-pointer focus:bg-destructive/90 text-destructive"
//                 onClick={async () => {
//                   await dispatch(logoutAsync());
//                   dispatch(clearUser());
//                   router.push('/tenant/login');
//                 }}
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </header>
//     );
//   }

//   // ✅ AUTH PAGE HEADER (Not logged in)
//   return (
//     <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="relative flex items-center justify-center w-10 h-10">
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
//           <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
//             <Home className="w-5 h-5 text-white stroke-[2.5]" />
//           </div>
//         </div>
//         <span className="text-slate-900 font-bold text-xl tracking-tight">RentSphere</span>
//       </div>

//       <div className="flex items-center gap-4">
//         <span className="text-slate-400 text-sm hidden sm:block">
//           {authAction === 'signup' ? "Already have an account?" : 
//            authAction === 'resetPassword' ? "Back to login?" : "Don't have an account?"}
//         </span>
//         <Link 
//           href={authAction === 'signup' ? "/tenant/login" : 
//                 authAction === 'resetPassword' ? "/tenant/login" : "/tenant/signup"}
//         >
//           <Button 
//             variant="default" 
//             size="sm" 
//             className="bg-emerald-600 text-white font-semibold rounded-lg px-6 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
//           >
//             {authAction === 'signup' ? "Sign In" : 
//              authAction === 'resetPassword' ? "Login" : "Sign Up"}
//           </Button>
//         </Link>
//       </div>
//     </header>
//   );
// }



'use client';

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessageCircle, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAsync } from "@/features/auth/authThunks";
import { clearUser } from "@/features/auth/authSlice";

interface AuthHeaderProps {
  isAuthPage?: boolean;
  authAction?: 'login' | 'signup' | 'resetPassword';
}

export default function AuthHeader({ 
  isAuthPage = false, 
  authAction = 'signup' 
}: AuthHeaderProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { userData } = useAppSelector(state => state.auth);
  const isLoggedIn = !!userData;
  
  // Use .includes to catch both /tenant/dashboard and /landlord/dashboard
  const isDashboard = pathname.includes('/dashboard');

  // ✅ LOGGED IN DASHBOARD HEADER
  if (isLoggedIn || isDashboard) {
    return (
      <header className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <Home className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="text-slate-900 font-bold text-xl tracking-tight hidden md:block">
            RentSphere
          </span>
        </div>

        {/* Right side: Actions + Profile */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-50 text-slate-500">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-50 text-slate-500">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-2 py-1 h-auto rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all ml-2"
              >
                {/* User Name displayed next to avatar */}
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                  {userData?.firstName || 'User'}
                </span>
                
                <Avatar className="h-8 w-8 border border-emerald-100 shadow-sm">
                  {/* <AvatarImage src={userData?.avatar || ''} /> */}
                  <AvatarFallback className="bg-emerald-600 text-white text-[10px] font-bold uppercase">
                    {userData?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56 mt-1" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-slate-900">
                    {userData?.firstName} 
                  </p>
                  <p className="text-xs leading-none text-slate-500 truncate">
                    {userData?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer py-2 text-slate-600">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 text-slate-600">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer py-2 text-red-500 focus:text-red-600 focus:bg-red-50"
                onClick={async () => {
                  await dispatch(logoutAsync());
                  dispatch(clearUser());
                  router.push('/tenant/login');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }

  // ✅ AUTH PAGE HEADER (Not logged in)
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
          <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
        </div>
        <span className="text-slate-900 font-bold text-xl tracking-tight">RentSphere</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm hidden sm:block">
          {authAction === 'signup' ? "Already have an account?" : 
           authAction === 'resetPassword' ? "Back to login?" : "Don't have an account?"}
        </span>
        <Link 
          href={authAction === 'signup' ? "/tenant/login" : 
                authAction === 'resetPassword' ? "/tenant/login" : "/tenant/signup"}
        >
          <Button 
            variant="default" 
            size="sm" 
            className="bg-emerald-600 text-white font-semibold rounded-lg px-6 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
          >
            {authAction === 'signup' ? "Sign In" : 
             authAction === 'resetPassword' ? "Login" : "Sign Up"}
          </Button>
        </Link>
      </div>
    </header>
  );
}
