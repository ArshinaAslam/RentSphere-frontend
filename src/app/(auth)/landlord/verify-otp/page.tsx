
'use client';

import React from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import OtpForm from "@/components/auth/otpFrom";
import { resendOtpAsync, verifyLandlordOtpAsync, verifyTenantOtpAsync } from "@/features/auth/authThunks";  
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LandlordOtpVerification() {  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';

  const handleVerify = async (otp: string) => {
    if (otp.length !== 6) return;
    
    
     const result = await dispatch(verifyTenantOtpAsync({ email, otp ,role:"LANDLORD"})).unwrap();
    console.log("rtyuu",result)
    toast.success("OTP Verified Successfully!");
    sessionStorage.setItem('fullName', result.data.kycData.fullName);
     sessionStorage.setItem('phone',result.data.kycData.phone)
     
      router.replace("/landlord/kyc-details"); 
  };

  const handleResend = async () => {
    await dispatch(resendOtpAsync({ email,role:'LANDLORD' })).unwrap();  
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
