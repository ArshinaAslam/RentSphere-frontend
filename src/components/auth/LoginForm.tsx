

'use client';

import React from 'react';

import Link from 'next/link';

import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
 
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { LoginValues } from '@/constants/authValidation';

import type { UseFormReturn } from 'react-hook-form';


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
      
      
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
          <Home className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-slate-500 text-sm">Sign in to manage your rentals</p>
        
     
        {error && (
          <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full text-center">
            {error}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-6">
      
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

        
                  <div className="flex justify-end">
            <Link href={forgotPasswordHref} className="text-sm font-semibold text-emerald-600 hover:underline">
              Forgot password?
            </Link>
          </div>

       
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-md font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex gap-2"
          >
            <Lock className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

        
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>





          
{googleButton && (
  <div className="w-full flex justify-center mb-6">  
    {googleButton}
  </div>                                             
)}


<div className="text-center pt-2">                   
  <p className="text-sm text-slate-500">
    Don't have an account?{' '}
    <Link href={signupHref} className="text-emerald-600 font-bold hover:underline">
      Sign up
    </Link>
  </p>
</div>  

       <div className="flex justify-center gap-4 pt-4 border-t border-slate-50">  
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