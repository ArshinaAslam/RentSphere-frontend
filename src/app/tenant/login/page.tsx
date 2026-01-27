// src/app/tenant/login/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginTenantAsync } from '@/features/auth/authThunks';
import { loginSchema, LoginValues } from '@/constants/validation';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';

export default function TenantLogin() {
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

  // ✅ Your onSubmit logic is now in this main page
  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginTenantAsync(data));
    if (loginTenantAsync.fulfilled.match(result)) {
      router.push(result.payload.redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader authAction="login" isAuthPage={true} />
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Sign in to manage your rentals</p>
            {error && (
              <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">
                {error}
              </p>
            )}
          </div>

          {/* Reusable LoginForm component */}
          <LoginForm
            form={form}
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword((prev) => !prev)}
            loading={loading}
            error={error || undefined}
            onSubmit={form.handleSubmit(handleLogin)} 
            forgotPasswordHref="/tenant/forgot-password"
          />
        </div>
      </main>
    </div>
  );
}
