


// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { signupAsync } from '@/features/auth/authThunks';
// import { signupSchema, SignupValues } from '@/constants/validation';
// import { Eye, EyeOff, Mail, Phone, Lock, User } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import Link from 'next/link';

// import AuthHeader from '@/components/auth/AuthHeader';

// export default function Signup() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
  
//   const searchParams = useSearchParams();
//   const role = searchParams.get('role') || 'TENANT';

//   const { loading, error, userData } = useAppSelector((state) => state.auth);
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const form = useForm<SignupValues>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirmPassword: '',
//       agreeToTerms: false,
//     },
//   });

//   const onSubmit = async (data: SignupValues) => {
//     const result = await dispatch(
//       signupAsync({ data, role })
//     ).unwrap();

//     console.log("result:",result)

//     sessionStorage.setItem('signupEmail', result.data.email);
//     sessionStorage.setItem('signupRole', role);


//     console.log(result.data.email)
    
  
    
// router.push(result.data.redirectTo);
//   };

//   return (
//    <div className="min-h-screen bg-slate-50 flex flex-col  font-sans">
//          <AuthHeader authAction="signup" isAuthPage={true} />
//          <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
//       <div className="w-full max-w-lg">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
//           <p className="text-slate-500">Join RentSphere as a {role}</p>
//           {error && (
//             <p className="text-red-500 mt-2 text-sm">{error}</p>
//           )}
//         </div>

//         <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
//               {/* Name Fields */}
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>First Name</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                           <Input placeholder="Enter first name" {...field} className="pl-10 rounded-xl" />
//                         </div>
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Last Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter last name" {...field} className="rounded-xl" />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Email & Phone */}
//               <FormField control={form.control} name="email" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                       <Input type="email" placeholder="Enter email" {...field} className="pl-10 rounded-xl" />
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )} />
              
//               <FormField control={form.control} name="phone" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                       <Input placeholder="Enter phone (+91...)" {...field} className="pl-10 rounded-xl" />
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )} />

//               {/* Password Fields */}
//               <FormField control={form.control} name="password" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                       <Input 
//                         type={showPassword ? 'text' : 'password'} 
//                         placeholder="Create password" 
//                         {...field} 
//                         className="pl-10 rounded-xl" 
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="confirmPassword" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Confirm Password</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                       <Input 
//                         type={showConfirmPassword ? 'text' : 'password'} 
//                         placeholder="Re-enter password" 
//                         {...field} 
//                         className="pl-10 rounded-xl" 
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       >
//                         {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )} />

//               {/* Terms */}
//               <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
//                 <FormItem>
//                   <div className="flex items-start space-x-3 py-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         className="mt-1 border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
//                       />
//                     </FormControl>
//                     <Label className="text-sm leading-relaxed text-slate-500 cursor-pointer font-normal">
//                       I agree to the{' '}
//                       <Link href="/terms" className="text-emerald-600 font-semibold hover:underline">
//                         Terms of Service
//                       </Link>{' '}
//                       and{' '}
//                       <Link href="/privacy" className="text-emerald-600 font-semibold hover:underline">
//                         Privacy Policy
//                       </Link>
//                     </Label>
//                   </div>
//                   <FormMessage className="text-xs" />
//                 </FormItem>
//               )} />

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all py-6 text-lg font-bold rounded-xl shadow-lg shadow-emerald-100"
//               >
//                 {loading ? 'Creating Account...' : 'Create Account'}
//               </Button>

//               {/* Divider + Google */}
//               <div className="relative flex items-center py-4">
//                 <div className="flex-grow border-t border-slate-100" />
//                 <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">
//                   Or continue with
//                 </span>
//                 <div className="flex-grow border-t border-slate-100" />
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full py-6 rounded-xl border-slate-200 flex items-center justify-center gap-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all"
//                 onClick={() => console.log('Google Auth')}
//               >
//                 <svg className="h-5 w-5" viewBox="0 0 24 24" /* Google SVG paths */ />
//                 Google
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </div>
//       </main>
//     </div>
//   );
// }


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
import { useGoogleLogin } from '@react-oauth/google';

export default function TenantSignup() {
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


   const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await dispatch(googleAuthAsync({ token: tokenResponse.access_token, role:"TENANT" }));
    },
    onError: (error) => console.error('Google auth failed', error),
  });

  const onSubmit = async (data: SignupValues) => {
      
      const result = await dispatch(signupAsync({ data, role: 'TENANT' })).unwrap();
      
      sessionStorage.setItem('signupEmail', result.data.email);
      sessionStorage.setItem('signupRole', 'TENANT');
      
      router.push('/tenant/verify-otp');
  
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AuthHeader authAction="signup" isAuthPage={true} />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
            <p className="text-slate-500">Join RentSphere as a Tenant</p>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <SignupForm
            form={form}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordToggle={handlePasswordToggle}
            role="Tenant"
            onGoogleLogin={() => googleLogin()}
            loading={loading}
            error={error || undefined} 
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}
