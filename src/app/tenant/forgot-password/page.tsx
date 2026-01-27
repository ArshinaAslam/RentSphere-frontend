// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Mail, Lock, ArrowLeft, SendHorizontal } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { forgotPasswordSchema, ForgotPasswordValues } from '@/constants/validation';



// export default function ForgotPasswordPage() {
//   const form = useForm<ForgotPasswordValues>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: '',
//     },
//   });

//   const onSubmit = async (data: ForgotPasswordValues) => {
//     console.log('Reset email sent to:', data.email);
//     // Add your backend dispatch logic here
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4 font-sans">
//       <div className="w-full max-w-[440px]">
//         {/* Main Card */}
//         <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 flex flex-col items-center border border-slate-50">
          
//           {/* Header Icon */}
//           <div className="mb-6">
//             <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
//               <Lock className="w-6 h-6 text-[#00A86B]" strokeWidth={2.5} />
//             </div>
//           </div>

//           <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
          
//           <p className="text-slate-400 text-center text-sm leading-relaxed mb-8">
//             Enter your registered email address. We&apos;ll send you instructions to reset your password.
//           </p>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">Email Address</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
//                         <Input 
//                           placeholder="name@example.com" 
//                           {...field} 
//                           className="h-12 pl-11 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm"
//                         />
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="w-full h-12 bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold rounded-xl transition-all flex gap-2 items-center justify-center shadow-lg shadow-emerald-100"
//               >
//                 <SendHorizontal className="w-4 h-4" />
//                 Verify Email
//               </Button>
//             </form>
//           </Form>

//           {/* Info Box */}
//           <div className="mt-6 w-full p-4 bg-slate-50 rounded-xl border border-slate-100">
//             <p className="text-[0.7rem] text-slate-500 flex gap-2">
//               <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1 shrink-0" />
//               If your email is registered, an OTP will be sent to your email within a few minutes.
//             </p>
//           </div>
//         </div>

//         {/* Navigation Link */}
//         <div className="mt-8 text-center">
//           <Link
//             href="/login"
//             className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider"
//           >
//             <ArrowLeft className="w-3.5 h-3.5" />
//             Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/app/tenant/forgot-password/page.tsx ✅ LIKE YOUR SIGNUP
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordTenantAsync } from '@/features/auth/authThunks';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/constants/validation';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'


export default function TenantForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [localError, setLocalError] = useState('');

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  
  const onSubmit = async (data: ForgotPasswordValues) => {
    const result = await dispatch(forgotPasswordTenantAsync( data )).unwrap();
    
  sessionStorage.setItem('Email', result.data.email);
    
    router.push('/tenant/forgot-verify-otp');  
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader authAction="login" isAuthPage={true} />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h1>
            <p className="text-slate-500 text-sm">Reset access to your tenant account</p>
            {error && (
              <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">{error}</p>
            )}
          </div>

          {/* Reusable Form - passes data to onSubmit */}
          <ForgotPasswordForm
            form={form}
            loading={loading}
            error={localError || error || undefined}
            backLink="/tenant/login"
            backText="Back to Login"
            onSubmit={onSubmit}  // ✅ Passes the function that receives data
          />
        </div>
      </main>
    </div>
  );
}
