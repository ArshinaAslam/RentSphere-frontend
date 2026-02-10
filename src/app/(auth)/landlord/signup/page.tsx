




'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { googleAuthAsync, signupAsync } from '@/features/auth/authThunks';
import { signupSchema, SignupValues } from '@/constants/authValidation';

import SignupForm from '@/components/auth/SignupForm';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function TenantSignup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const handlePasswordToggle = (type: 'password' | 'confirmPassword') => {
    if (type === 'password') setShowPassword(prev => !prev);
    else setShowConfirmPassword(prev => !prev);
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
        role: 'LANDLORD',
      })
    );
    
   router.push(result.payload.redirectTo)
  };
  

  const onSubmit = async (data: SignupValues) => {
    const result = await dispatch(signupAsync({ data, role: 'LANDLORD' })).unwrap();
    
    
    sessionStorage.setItem('signupEmail', result.data.email);
    sessionStorage.setItem('signupRole', 'LANLORD');
    
    router.push('/landlord/verify-otp');
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
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Google login failed')}
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