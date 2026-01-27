// 'use client';

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { resendOtpAsync, verifyTenantOtp } from "@/features/auth/authThunks";
// import { ArrowLeft, RotateCw, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
//  import { toast } from "sonner";

// export default function OtpVerification() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
 
//   const searchParams = useSearchParams();


//   const email =  sessionStorage.getItem('signupEmail') || '';
//   const role =  sessionStorage.getItem('signupRole') || 'tenant';

//   const { loading, error } = useAppSelector((state) => state.auth);

//   const [otp, setOtp] = useState("");
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [canResend, setCanResend] = useState(false);

 
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleResendCode = async () => {
//     if (!canResend || loading) return;

//     const result = await dispatch(resendOtpAsync({ email }));
    
//     if (resendOtpAsync.fulfilled.match(result)) {
//       toast.success("OTP resent!.Check your email.");
//       setTimeLeft(60);
//       setCanResend(false);
//       setOtp("");
//     }
//   };

//   const handleVerify = async () => {
//     if (otp.length !== 6) return;

//     const result = await dispatch(verifyTenantOtp({ email, otp }))

//     if (verifyTenantOtp.fulfilled.match(result)) {
//       toast.success("Otp Verified Successfully");
      
     
//       sessionStorage.removeItem('signupEmail');
//       sessionStorage.removeItem('signupRole');
      
//       router.push(result.payload.redirectTo);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
//       <main className="flex-1 flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-[2rem] shadow-2xl p-8">
//             <div className="flex justify-center mb-8">
//               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
//                 <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
//               </div>
//             </div>

//             <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
//               Verify Account
//             </h1>

//             <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
//               We've sent a code to <br />
//               <span className="font-semibold text-slate-900">{email || 'your email'}</span>
//             </p>

//             {/* ✅ Redux Error Display */}
//             {error && (
//               <div className="text-red-500 text-center text-xs mb-6 bg-red-50 p-3 rounded-xl border">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-8">
//               <InputOTP
//                 maxLength={6}
//                 value={otp}
//                 onChange={(value) => setOtp(value)}
//               >
//                 <InputOTPGroup className="gap-3 justify-center">
//                   {[...Array(6)].map((_, i) => (
//                     <InputOTPSlot 
//                       key={i} 
//                       index={i} 
//                       className="w-14 h-16 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 ring-emerald-200 shadow-sm"
//                     />
//                   ))}
//                 </InputOTPGroup>
//               </InputOTP>

//               <div className="text-center space-y-2">
//                 <p className="text-slate-400 text-xs uppercase tracking-widest">Expires in</p>
//                 <p className="text-3xl font-bold text-emerald-600">
//                   {formatTime(timeLeft)}
//                 </p>
//               </div>

//               <Button
//                 onClick={handleVerify}
//                 disabled={otp.length !== 6 || loading}
//                 className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
//               >
//                 {loading ? 'Verifying...' : 'Verify & Continue'}
//               </Button>

//               <div className="pt-4 pt-6 border-t border-slate-100">
//                 <button
//                   onClick={handleResendCode}
//                   disabled={!canResend || loading}
//                   className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
//                     canResend 
//                       ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" 
//                       : "text-slate-400 bg-slate-50 cursor-not-allowed"
//                   }`}
//                 >
//                   <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                   {loading ? 'Sending...' : 'Resend Code'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 text-center">
//             <Link
//               href="/signup"
//               className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Sign Up
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resendOtpAsync, verifyTenantOtpAsync } from "@/features/auth/authThunks";
import { toast } from "sonner";
import AuthHeader from "@/components/auth/AuthHeader";
import OtpForm from "@/components/auth/otpFrom";

export default function TenantOtpVerification() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';

  const handleVerify = async (otp: string) => {
    if (otp.length !== 6) return;
    
   
      const result = await dispatch(verifyTenantOtpAsync({ email, otp })).unwrap();
      toast.success("OTP Verified Successfully!");
      sessionStorage.removeItem('signupEmail');
      sessionStorage.removeItem('signupRole');
      router.replace("/tenant/login");
    
  };

  const handleResend = async () => {
  
      await dispatch(resendOtpAsync({ email })).unwrap();
      toast.success("OTP resent! Check your email.");
   
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <AuthHeader authAction="signup" isAuthPage={true} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <OtpForm 
            email={email}
            loading={loading}
            error={error || null}
            onVerify={handleVerify}
            onResend={handleResend}
          />
          {/* Back Link */}
          <div className="mt-8 text-center">
            <a href="/tenant" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
              ← Back to Sign Up
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
