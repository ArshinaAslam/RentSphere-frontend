'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Shield, Home } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminLoginSchema, AdminLoginValues } from '@/constants/authValidation';
import { loginAdminAsync } from '@/features/auth/authThunks';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function AdminLoginPage() {
    const router  = useRouter()
    const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const { tokens,userData } = useAppSelector((state) => state.auth);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
  });

//   const onSubmit = async (data: AdminLoginValues) => {
//    const result = await loginAdminAsync(data).unwrap()
//   };
useEffect(() => {
    if (tokens && userData && userData?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [tokens, userData, router]);

  const onSubmit = async (data: AdminLoginValues) => {
    try {
      // Dispatch admin login thunk
      const result = await dispatch(loginAdminAsync(data)).unwrap();
      
      // Success - redirect to admin dashboard
      router.push('/admin/dashboard');
      
      // Optional: Show success toast (if you have toast notifications)
      // toast.success('Admin login successful!');
      
    } catch (err: any) {
      // Error handled by Redux slice - displayed automatically
      console.error('Admin login failed:', err);
      
      // Optional: Reset form on error
      form.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md">
        
        {/* Login Card */}
        <div className="bg-card rounded-[32px] shadow-2xl border border-border p-10 animate-in fade-in zoom-in duration-500">
          
          {/* ✅ Logo moved inside the card and centered */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#6A5ACD] rounded-2xl flex items-center justify-center shadow-xl shadow-[#6A5ACD]/20">
              <Home className="w-9 h-9 text-white stroke-[2.5]" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-card-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter your email" 
                          {...field} 
                          className="h-12 pl-10 bg-secondary border-border focus-visible:ring-[#6A5ACD] rounded-xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-card-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          {...field} 
                          className="h-12 pl-10 pr-10 bg-secondary border-border focus-visible:ring-[#6A5ACD] rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-background rounded-full text-muted-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    
                    <div className="flex justify-end">
                      <a href="#" className="text-xs font-bold text-[#6A5ACD] hover:opacity-80 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#6A5ACD] hover:bg-[#6A5ACD]/90 text-white font-bold rounded-xl shadow-lg shadow-[#6A5ACD]/20 active:scale-[0.98] transition-all text-base"
              >
                <Lock className="w-4 h-4 mr-2" />
                Log In
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground pt-2">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Protected by enterprise-grade security</span>
              </div>
            </form>
          </Form>
        </div>

        {/* Support Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help? Contact support at{" "}
          <a
            href="mailto:support@rentsphere.com"
            className="text-[#6A5ACD] font-semibold hover:opacity-80 transition-colors"
          >
            support@rentsphere.com
          </a>
        </p>
      </div>
    </div>
  );
}