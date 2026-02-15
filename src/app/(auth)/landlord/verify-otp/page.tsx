
// 'use client';

// import React from "react";
// import { useRouter } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { resendOtpAsync, verifyLandlordOtpAsync } from "@/features/auth/authThunks"; 
// import { toast } from "sonner";
// import AuthHeader from "@/components/auth/AuthHeader";
// import OtpForm from "@/components/auth/otpFrom";

// export default function LandlordOtpVerification() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { loading, error } = useAppSelector((state) => state.auth);


//   const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';

  
//   const handleVerify = async (otp: string) => {
//     if (otp.length !== 6) return;
 
//       const result = await dispatch(verifyLandlordOtpAsync({ email, otp })).unwrap();
//       toast.success("OTP Verified Successfully!");
//         sessionStorage.setItem('fullName', result.data.fullName);
//         sessionStorage.setItem('phone',result.data.phone)
     
//       router.replace("/landlord/kyc-details"); 

//   };

//   const handleResend = async () => {
//     try {
//       await dispatch(resendOtpAsync({ email })).unwrap();
//       toast.success("OTP resent! Check your email.");
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
//       <AuthHeader authAction="signup" isAuthPage={true} />
//       <main className="flex-1 flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-md">
//           <OtpForm 
//             email={email}
//             loading={loading}
//             error={error || null}
//             onVerify={handleVerify}
//             onResend={handleResend}
//           />
//           {/* Back Link */}
//           <div className="mt-8 text-center">
//             <a href="/landlord" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
//               ← Back to Sign Up
//             </a>
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
import { resendOtpAsync, verifyLandlordOtpAsync } from "@/features/auth/authThunks";  
import { toast } from "sonner";
import OtpForm from "@/components/auth/otpFrom";

export default function LandlordOtpVerification() {  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';

  const handleVerify = async (otp: string) => {
    if (otp.length !== 6) return;
    
    
    const result = await dispatch(verifyLandlordOtpAsync({ email, otp })).unwrap();
    console.log("rtyuu",result)
    toast.success("OTP Verified Successfully!");
    sessionStorage.setItem('fullName', result.data.kycData.fullName);
     sessionStorage.setItem('phone',result.data.kycData.phone)
     
      router.replace("/landlord/kyc-details"); 
  };

  const handleResend = async () => {
    await dispatch(resendOtpAsync({ email })).unwrap();  
    toast.success("OTP resent! Check your email.");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans pt-20 pb-20">
      <main className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-md">
          <OtpForm 
            email={email}
            loading={loading}
            error={error || null}
            onVerify={handleVerify}
            onResend={handleResend}
          />
        </div>
      </main>
    </div>
  );
}
