

'use client';

import React from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import OtpForm from "@/components/auth/otpFrom";
import { resendOtpAsync, verifyTenantOtpAsync } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TenantOtpVerification() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const email = typeof window !== 'undefined' ? sessionStorage.getItem('Email') || '' : '';
  const role =  typeof window !== 'undefined' ? sessionStorage.getItem('signupRole') || '' : '';

  const handleVerify = async (otp: string) => {
    if (otp.length !== 6) return;
    
   
      const result = await dispatch(verifyTenantOtpAsync({ email, role,otp })).unwrap();
      toast.success("OTP Verified Successfully!");

     
      router.replace("/tenant/reset-password");
    
  };

  const handleResend = async () => {
  
      await dispatch(resendOtpAsync({ email,role })).unwrap();
      toast.success("OTP resent! Check your email.");
   
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      
      <main className="flex-1 flex items-center justify-center px-4 py-20
      ">
        <div className="w-full max-w-md">
          <OtpForm 
            email={email}
            loading={loading}
            error={error || null}
            onVerify={handleVerify}
            onResend={handleResend}
          />
          {/* Back Link */}
         
        </div>
      </main>
    </div>
  );
}
