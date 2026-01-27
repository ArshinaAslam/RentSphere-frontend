// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { loginLandlordAsync } from '@/features/auth/authThunks';  // 🔧 CHANGE: loginLandlordAsync
// import { loginSchema, LoginValues } from '@/constants/validation';
// import AuthHeader from '@/components/auth/AuthHeader';
// import LoginForm from '@/components/auth/LoginForm';

// export default function LandlordLogin() {  // 🔧 CHANGE: LandlordLogin
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { loading, error } = useAppSelector((state) => state.auth);
  
//   const [showPassword, setShowPassword] = useState(false);

//   const form = useForm<LoginValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//       rememberMe: false,
//     },
//   });

//   const handlePasswordToggle = () => {
//     setShowPassword(prev => !prev);
//   };

//   // 🔧 CHANGE: loginLandlordAsync + landlordDashboard
//   const onSubmit = async (data: LoginValues) => {
//     const result = await dispatch(loginLandlordAsync(data));
    
//     if (loginLandlordAsync.fulfilled.match(result)) {
//       router.push(result.payload.redirectTo || '/landlordDashboard');
//     }
//     // Error handled by Redux ✅
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
//       <AuthHeader authAction="login" isAuthPage={true} />
//       <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
//         <div className="w-full max-w-lg">
//           {/* Header */}
//           <div className="text-center mb-8 flex flex-col items-center">
//             <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
//               <span className="text-white font-bold text-2xl">R</span>
//             </div>
//             <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
//             {/* 🔧 CHANGE: Landlord-specific text */}
//             <p className="text-slate-500 text-sm">Sign in to manage your properties</p>
//             {error && (
//               <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">{error}</p>
//             )}
//           </div>

//           {/* Login Form Component */}
//           <LoginForm
//             form={form}
//             showPassword={showPassword}
//             onPasswordToggle={handlePasswordToggle}
//             loading={loading}
//             error={error || undefined}
//             onSubmit={form.handleSubmit(onSubmit)}
//           />
//         </div>
//       </main>
//     </div>
//   );
// }


// src/app/landlord/login/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginLandlordAsync } from '@/features/auth/authThunks'; // ← your landlord thunk
import { loginSchema, LoginValues } from '@/constants/validation';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';

export default function LandlordLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginLandlordAsync(data));
    if (loginLandlordAsync.fulfilled.match(result)) {
      router.push(result.payload.redirectTo || '/landlordDashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader authAction="login" isAuthPage={true} />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Landlord Sign In</h1>
            <p className="text-slate-500 text-sm">Sign in to manage your properties</p>
            {error && (
              <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">
                {error}
              </p>
            )}
          </div>

          {/* Reusable LoginForm with landlord forgot-password */}
          <LoginForm
            form={form}
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword((prev) => !prev)}
            loading={loading}
            error={error || undefined}
            onSubmit={form.handleSubmit(handleLogin)}
            forgotPasswordHref="/landlord/forgot-password" // ✅ Landlord-specific page
          />
        </div>
      </main>
    </div>
  );
}

