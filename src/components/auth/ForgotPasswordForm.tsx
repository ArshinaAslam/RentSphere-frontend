// components/auth/ForgotPasswordForm.tsx ✅ FIXED onSubmit
'use client';

import React from 'react';
import { Mail, Home, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { ForgotPasswordValues } from '@/constants/authValidation';

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPasswordValues>;
  loading: boolean;
  backLink: string;
  backText: string;
  error?: string;
  onSubmit: (data: ForgotPasswordValues) => void;  
}

export default function ForgotPasswordForm({
  form,
  loading,
  backLink,
  backText,
  error,
  onSubmit
}: ForgotPasswordFormProps) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 flex flex-col items-center border border-slate-50">
      {/* Header Icon */}
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
          <Home className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3 text-center">Reset Password</h1>
      
      <p className="text-slate-500 text-sm text-center leading-relaxed mb-8 max-w-md">
        Enter your registered email. We'll send you instructions to reset your password.
      </p>

      {error && (
        <div className="w-full mb-6 p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">  {/* ✅ handleSubmit */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Enter your email" 
                      {...field}
                      disabled={loading}
                      className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all text-base" 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-lg shadow-lg shadow-emerald-100/50 transition-all flex gap-2 items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending otp...
              </>
            ) : (
              <>
                <SendHorizontal className="w-5 h-5" />
                Send Otp
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Info Box */}
      <div className="mt-8 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs text-slate-600 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-400 rounded-full" />
          Check spam folder if you don't receive email in 2 minutes.
        </p>
      </div>
    </div>
  );
}
