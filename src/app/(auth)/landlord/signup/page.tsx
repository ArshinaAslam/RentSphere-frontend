"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";

import SignupForm from "@/components/auth/SignupForm";
import type { SignupValues } from "@/constants/authValidation";
import { signupSchema } from "@/constants/authValidation";
import { googleAuthAsync, signupAsync } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import type { CredentialResponse } from "@react-oauth/google";

export default function TenantSignup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const handlePasswordToggle = (type: "password" | "confirmPassword") => {
    if (type === "password") setShowPassword((prev) => !prev);
    else setShowConfirmPassword((prev) => !prev);
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) return;

    try {
      const result = await dispatch(
        googleAuthAsync({
          token: credentialResponse.credential,
          role: "LANDLORD",
        }),
      ).unwrap();

      const kycStatus = result?.user.kycStatus;

      if (
        !kycStatus ||
        kycStatus === "NOT_SUBMITTED" ||
        kycStatus === "PENDING"
      ) {
        router.push("/landlord/kyc-details");
      } else {
        router.push("/landlord/dashboard");
      }
    } catch (err) {
      console.error("Google auth failed:", err);
    }
  };

  const onSubmit = (data: SignupValues) => {
    dispatch(signupAsync({ data, role: "LANDLORD" }))
      .unwrap()
      .then((result) => {
        sessionStorage.setItem("signupEmail", result.email);
        sessionStorage.setItem("signupRole", "LANDLORD");
        router.push("/landlord/verify-otp");
      })
      .catch((err: unknown) => {
        console.error("Signup failed:", err);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-20 pb-20">
      <main className="flex-1 flex flex-col items-center justify-start py-1 px-4">
        <div className="w-full max-w-lg">
          <SignupForm
            form={form}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordToggle={handlePasswordToggle}
            role="Landlord"
            googleButton={
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  void handleGoogleSuccess(credentialResponse);
                }}
                onError={() => console.error("Google login failed")}
              />
            }
            loading={loading}
            error={error || undefined}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}
