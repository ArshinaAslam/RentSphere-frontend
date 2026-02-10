
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordAsync } from '@/features/auth/authThunks';
import { resetPasswordSchema, ResetPasswordValues } from '@/constants/authValidation';
import {toast} from 'sonner'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function TenantResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const [error, setError] = useState('');
  const email = typeof window !== 'undefined' ? sessionStorage.getItem('Email') || "" : "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // const onSubmit = async (data: ResetPasswordValues) => {
  //    setError(''); 

  
  //     const result = await dispatch(resetPasswordAsync({email,password:data.password,confirmPassword:data.confirmPassword })).unwrap();
  //    sessionStorage.removeItem('Email');
  //     router.push('/tenant/login');
   
  // };

    const onSubmit = async (data: ResetPasswordValues) => {
    try {
      setError(''); 
      await dispatch(resetPasswordAsync({email,password:data.password,confirmPassword:data.confirmPassword })).unwrap();
      toast.success("Password reset successful!");
      sessionStorage.removeItem('Email');
      router.push('/tenant/login');
    } catch (err: any) {
      
      setError(err?.message || 'Password reset failed');
    }
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
            onPasswordToggle={() => setShowPassword(prev => !prev)}
            onConfirmPasswordToggle={() => setShowConfirmPassword(prev => !prev)}
          />
        </div>
      </main>
    </div>
  );
}
