


'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';

import LoginForm from '@/components/auth/LoginForm';
import type { LoginValues } from '@/constants/authValidation';
import { loginSchema } from '@/constants/authValidation';
import { clearError } from '@/features/auth/authSlice';
import { googleAuthAsync, loginTenantAsync } from '@/features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { CredentialResponse } from '@react-oauth/google';

export default function TenantLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
    const role =  typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') || '' : '';
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      
    },
  });
    useEffect(() => {
    dispatch(clearError());  
  }, [dispatch]);
  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginTenantAsync({data,role: 'TENANT'}));
    if (loginTenantAsync.fulfilled.match(result)) {
     
      router.replace('/tenant/dashboard');
    }
  };

  
     const handleGoogleSuccess = async (
      credentialResponse: CredentialResponse
    ) => {
      if (!credentialResponse.credential) {
        console.error('No ID token received from Google');
        return;
      }
  
     const result =  await dispatch(
        googleAuthAsync({
          token: credentialResponse.credential, 
          role: 'TENANT',
        })
      );
      
     router.push(result.payload.redirectTo)
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
             googleButton={
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.error('Google login failed')}
                          />
                        }
            forgotPasswordHref="/tenant/forgot-password"
            signupHref="/tenant/signup"
          />
        </div>
      </main>
    </div>
  );
}
