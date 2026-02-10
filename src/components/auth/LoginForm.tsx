

'use client';

import React from 'react';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { LoginValues } from '@/constants/authValidation';

interface LoginFormProps {
  form: UseFormReturn<LoginValues>;
  showPassword: boolean;
  onPasswordToggle: () => void;
  loading: boolean;
  error?: string;
  onSubmit: () => void; 
  forgotPasswordHref: string;
   signupHref:string;
   googleButton?: React.ReactNode;
}

export default function LoginForm({
  form,
  showPassword,
  onPasswordToggle,
  loading,
  error,
  onSubmit,
  forgotPasswordHref,
   signupHref,
   googleButton,
}: LoginFormProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
      
      {/* ✅ Brand Logo & Header Section Integrated Here */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
          <Home className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 text-sm">Sign in to manage your rentals</p>
        
        {/* Error Message inside the card for better visibility */}
        {error && (
          <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full text-center">
            {error}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="pl-10 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-12"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                      className="pl-10 rounded-xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-12"
                    />
                    <button
                      type="button"
                      onClick={onPasswordToggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
                  <div className="flex justify-end">
            <Link href={forgotPasswordHref} className="text-sm font-semibold text-emerald-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-md font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex gap-2"
          >
            <Lock className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>


          {/* Google Button */}
          {/* <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-100 flex items-center justify-center gap-3 font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            onClick={() => console.log('Google Login')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button> */}


          
{googleButton && (
  <div className="w-full flex justify-center mb-6">  
    {googleButton}
  </div>                                             
)}

{/* Footer Link */}
<div className="text-center pt-2">                   
  <p className="text-sm text-slate-500">
    Don't have an account?{' '}
    <Link href={signupHref} className="text-emerald-600 font-bold hover:underline">
      Sign up
    </Link>
  </p>
</div>  

       <div className="flex justify-center gap-4 pt-4 border-t border-slate-50">  {/* New #2 OPEN */}
  <Link href="/privacy" className="text-[10px] text-slate-400 hover:text-slate-600">
    Privacy Policy
  </Link>
  <Link href="/terms" className="text-[10px] text-slate-400 hover:text-slate-600">
    Terms of Service
  </Link>
</div> 
        </form>
      </Form>
    </div>
  );
}