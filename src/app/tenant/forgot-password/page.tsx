
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordTenantAsync } from '@/features/auth/authThunks';
import { forgotPasswordSchema, ForgotPasswordValues } from '@/constants/authValidation';
// import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'


export default function TenantForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [localError, setLocalError] = useState('');

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  
  const onSubmit = async (data: ForgotPasswordValues) => {
    const result = await dispatch(forgotPasswordTenantAsync( data )).unwrap();
    
  sessionStorage.setItem('Email', result.data.email);
    
    router.push('/tenant/forgot-verify-otp');  
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-15">
      
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            
           
            {error && (
              <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">{error}</p>
            )}
          </div>

          
          <ForgotPasswordForm
            form={form}
            loading={loading}
            error={localError || error || undefined}
            backLink="/tenant/login"
            backText="Back to Login"
            onSubmit={onSubmit}  
          />
        </div>
      </main>
    </div>
  );
}
