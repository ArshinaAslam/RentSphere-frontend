'use client';

import React from 'react';
import { Eye, EyeOff, Mail, Phone, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { SignupValues } from '@/constants/validation';
import { UseFormReturn } from 'react-hook-form';

interface SignupFormProps {
  form: UseFormReturn<SignupValues>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordToggle: (type: 'password' | 'confirmPassword') => void;
  role: string;
  loading: boolean;
  error?: string;
  onSubmit: () => void;
}

export default function SignupForm({ 
  form, 
  showPassword, 
  showConfirmPassword, 
  onPasswordToggle, 
  role, 
  onGoogleLogin,
  loading, 
  error,
  onSubmit 
}: SignupFormProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input placeholder="Enter first name" {...field} className="pl-10 rounded-xl" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField 
            control={form.control} 
            name="email" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input type="email" placeholder="Enter email" {...field} className="pl-10 rounded-xl" />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} 
          />

          {/* Phone */}
          <FormField 
            control={form.control} 
            name="phone" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Enter phone (+91...)" {...field} className="pl-10 rounded-xl" />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} 
          />

          {/* Password */}
          <FormField 
            control={form.control} 
            name="password" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Create password" 
                      {...field} 
                      className="pl-10 rounded-xl" 
                    />
                    <button
                      type="button"
                      onClick={() => onPasswordToggle('password')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} 
          />

          {/* Confirm Password */}
          <FormField 
            control={form.control} 
            name="confirmPassword" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Re-enter password" 
                      {...field} 
                      className="pl-10 rounded-xl" 
                    />
                    <button
                      type="button"
                      onClick={() => onPasswordToggle('confirmPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} 
          />

          {/* Terms Checkbox */}
          <FormField 
            control={form.control} 
            name="agreeToTerms" 
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start space-x-3 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1 border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                  </FormControl>
                  <Label className="text-sm leading-relaxed text-slate-500 cursor-pointer font-normal">
                    I agree to the{' '}
                    <Link href="/terms" className="text-emerald-600 font-semibold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-emerald-600 font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )} 
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all py-6 text-lg font-bold rounded-xl shadow-lg shadow-emerald-100"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Divider + Google */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 rounded-xl border-slate-200 flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            onClick={() => googleLogin()}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.8 1 3.95 3.47 2.86 7.29l5.84 4.55c.87-2.6 3.3-4.46 6.3-4.46z"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
      </Form>
    </div>
  );
}
