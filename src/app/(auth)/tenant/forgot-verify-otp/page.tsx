"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import OtpForm from "@/components/auth/otpFrom";
import {
  resendOtpAsync,
  verifyOtpAsync,
} from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TenantOtpVerification() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("Email") || "" : "";
  const role =
    typeof window !== "undefined"
      ? sessionStorage.getItem("signupRole") || ""
      : "";

  const handleVerify = (otp: string) => {
    void (async () => {
      if (otp.length !== 6) return;

      await dispatch(verifyOtpAsync({ email, role, otp })).unwrap();
      toast.success("OTP Verified Successfully!");
      router.replace("/tenant/reset-password");
    })();
  };

  const handleResend = () => {
    void (async () => {
      await dispatch(resendOtpAsync({ email, role })).unwrap();
      toast.success("OTP resent! Check your email.");
    })();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <main
        className="flex-1 flex items-center justify-center px-4 py-20
      "
      >
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
