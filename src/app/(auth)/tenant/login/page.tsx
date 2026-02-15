


'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { googleAuthAsync, loginTenantAsync } from '@/features/auth/authThunks';
import { loginSchema, LoginValues } from '@/constants/authValidation';
import LoginForm from '@/components/auth/LoginForm';
import { clearError } from '@/features/auth/authSlice';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
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
    useEffect(() => {
    dispatch(clearError());  
  }, [dispatch]);
  const handleLogin = async (data: LoginValues) => {
    const result = await dispatch(loginTenantAsync(data));
    if (loginTenantAsync.fulfilled.match(result)) {
     
      router.replace(result.payload.redirectTo);
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
