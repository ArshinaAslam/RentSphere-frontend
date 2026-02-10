'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordLandlordAsync } from '@/features/auth/authThunks';  
import { forgotPasswordSchema, ForgotPasswordValues } from '@/constants/authValidation';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { clearError } from '@/features/auth/authSlice';

export default function LandlordForgotPassword() {  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [localError, setLocalError] = useState('');

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });


    useEffect(() => {
      dispatch(clearError());  
    }, [dispatch]);
  

  const onSubmit = async (data: ForgotPasswordValues) => {
    const result = await dispatch(forgotPasswordLandlordAsync(data)).unwrap();  
    sessionStorage.setItem('Email', result.data.email);
    router.push('/landlord/forgot-verify-otp');  
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-15">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
         
          {/* <div className="text-center mb-8 flex flex-col items-center">
            {error && (
              <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full">{error}</p>
            )}
          </div> */}

          <ForgotPasswordForm
            form={form}
            loading={loading}
            error={localError || error || undefined}
            backLink="/landlord/login"  
            backText="Back to Login"
            onSubmit={onSubmit}  
          />
        </div>
      </main>
    </div>
  );
}
