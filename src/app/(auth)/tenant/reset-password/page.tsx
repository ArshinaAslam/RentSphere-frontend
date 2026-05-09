"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { ResetPasswordValues } from "@/constants/authValidation";
import { resetPasswordSchema } from "@/constants/authValidation";
import { resetPasswordAsync } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function TenantResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    setError("");
    dispatch(resetPasswordAsync({ data, role: "TENANT" }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successful!");
        sessionStorage.removeItem("Email");
        router.push("/tenant/login");
      })
      .catch((err: { message?: string }) => {
        setError(err?.message || "Password reset failed");
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg">
          <ResetPasswordForm
            form={form}
            loading={loading}
            error={error}
            onSubmit={onSubmit}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordToggle={() => setShowPassword((prev) => !prev)}
            onConfirmPasswordToggle={() =>
              setShowConfirmPassword((prev) => !prev)
            }
          />
        </div>
      </main>
    </div>
  );
}
