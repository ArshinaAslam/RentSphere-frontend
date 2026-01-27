'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupAsync } from '@/features/auth/authThunks';
import { signupSchema, SignupValues } from '@/constants/validation';
import AuthHeader from '@/components/auth/AuthHeader';
import SignupForm from '@/components/auth/SignupForm';

export default function LandlordSignup() {  // 🔧 1. CHANGE: LandlordSignup
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

  // 🔧 2. CHANGE: Role = 'LANDLORD' + redirect to landlord verify-otp
  const onSubmit = async (data: SignupValues) => {
    const result = await dispatch(signupAsync({ data, role: 'LANDLORD' }));
    
    if (signupAsync.fulfilled.match(result)) {
      sessionStorage.setItem('signupEmail', result.payload.data.email);
      sessionStorage.setItem('signupRole', 'LANDLORD');
      router.push('/landlord/verify-otp');  // 🔧 Landlord OTP page
    }
    // Error automatically handled by Redux ✅
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader authAction="signup" isAuthPage={true} />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
            {/* 🔧 3. CHANGE: "Landlord" text */}
            <p className="text-slate-500">Join RentSphere as a Landlord</p>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <SignupForm
            form={form}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordToggle={handlePasswordToggle}
            role="Landlord"
            loading={loading}
            error={error || undefined}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}
