


'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginTenantAsync } from '@/features/auth/authThunks';
import { loginSchema, LoginValues } from '@/constants/authValidation';
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
      
    },
  });

  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginTenantAsync(data));
    if (loginTenantAsync.fulfilled.match(result)) {
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
            forgotPasswordHref="/tenant/forgot-password"
          />
        </div>
      </main>
    </div>
  );
}
