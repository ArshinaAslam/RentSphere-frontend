'use client';

import React from 'react';
import { Lock, Eye, EyeOff, Home } from 'lucide-react'; // Added Home icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ResetPasswordValues } from '@/constants/authValidation';

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordValues>;
  loading: boolean;
  error?: string;
  onSubmit: (data: ResetPasswordValues) => void | Promise<void>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
}

export default function ResetPasswordForm({
  form,
  loading,
 error,  
  onSubmit,
  showPassword,
  showConfirmPassword,
  onPasswordToggle,
  onConfirmPasswordToggle,
}: ResetPasswordFormProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-10 flex flex-col items-center">
      
      {/* ✅ Brand Logo Section Integrated Here */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
          <Home className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Set New Password</h1>
        <p className="text-slate-500 text-sm text-center leading-relaxed max-w-[280px]">
          Enter your new password below. Your password must meet the minimum security requirements.
        </p>

         {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl w-full">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      {...field}
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={onPasswordToggle}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      {...field}
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={onConfirmPasswordToggle}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password Requirements */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-3">
              Password requirements:
            </p>
            <ul className="space-y-2">
              <RequirementItem
                met={form.watch('password')?.length >= 8}
                label="At least 8 characters"
              />
              <RequirementItem
                met={/[0-9]/.test(form.watch('password') || '')}
                label="Include at least 1 number"
              />
              <RequirementItem
                met={/[^A-Za-z0-9]/.test(form.watch('password') || '')}
                label="Include at least 1 special character"
              />
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-100 mt-2"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Helper component
function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <div
        className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-300'}`}
      />
      <span className={met ? 'text-slate-700' : 'text-slate-400'}>{label}</span>
    </li>
  );
}