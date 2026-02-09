

// // src/app/landlord/login/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { loginLandlordAsync } from '@/features/auth/authThunks'; 
// import { loginSchema, LoginValues } from '@/constants/authValidation';
// import AuthHeader from '@/components/auth/AuthHeader';
// import LoginForm from '@/components/auth/LoginForm';

// export default function LandlordLogin() {
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

//   const handleLogin = async (data: LoginValues) => {
//     const result = await dispatch(loginLandlordAsync(data));
//     if (loginLandlordAsync.fulfilled.match(result)) {
//       router.push(result.payload.redirectTo || '/landlordDashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
//       <AuthHeader authAction="login" isAuthPage={true} />
      
//       <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
//         <div className="w-full max-w-lg">
//           {/* Header Section */}
//           <div className="text-center mb-8 flex flex-col items-center">
//             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
//               <span className="text-white font-bold text-2xl">L</span>
//             </div>
//             <h1 className="text-3xl font-bold text-slate-900 mb-2">Landlord Sign In</h1>
//             <p className="text-slate-500 text-sm">Sign in to manage your properties</p>
//             {error && (
//               <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">
//                 {error}
//               </p>
//             )}
//           </div>

          
//           <LoginForm
//             form={form}
//             showPassword={showPassword}
//             onPasswordToggle={() => setShowPassword((prev) => !prev)}
//             loading={loading}
//             error={error || undefined}
//             onSubmit={form.handleSubmit(handleLogin)}
//             forgotPasswordHref="/landlord/forgot-password" 
//           />
//         </div>
//       </main>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginLandlordAsync } from '@/features/auth/authThunks';  
import { loginSchema, LoginValues } from '@/constants/authValidation';
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
      
    },
  });

  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginLandlordAsync(data));  
    if (loginLandlordAsync.fulfilled.match(result)) {         
      router.push(result.payload.redirectTo);  
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-20 pb-20">
      <main className="flex-1 flex flex-col items-center justify-start px-4">
        <div className="w-full max-w-lg">
          <LoginForm
            form={form}
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword((prev) => !prev)}
            loading={loading}
            error={error || undefined}
            onSubmit={form.handleSubmit(handleLogin)} 
            forgotPasswordHref="/landlord/forgot-password"  
          />
        </div>
      </main>
    </div>
  );
}

