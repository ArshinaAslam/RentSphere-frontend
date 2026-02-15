


// 'use client';

// import React, { useState, useEffect, useCallback } from "react";
// import { Check, RotateCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// interface OtpFormProps {
//   email: string;
//   loading: boolean;
//   error: string | null;
//   onVerify: (otp: string) => void;
//   onResend: () => void;
// }

// export default function OtpForm({ 
//   email, 
//   loading, 
//   error, 
//   onVerify, 
//   onResend 
// }: OtpFormProps) {
  
//   const [otp, setOtp] = useState("");
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   // Timer logic
//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleResend = useCallback(() => {
//     setTimeLeft(60);
//     setCanResend(false);
//     setOtp("");
//     onResend();
//   }, [onResend]);

//   return (
//     <div className="bg-white rounded-[2rem] shadow-2xl p-8">
//       {/* Header */}
//       <div className="flex justify-center mb-8">
//         <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
//           <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
//         </div>
//       </div>

//       <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Verify Account</h1>
//       <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
//         We've sent a code to <br />
//         <span className="font-semibold text-slate-900">{email || 'your email'}</span>
//       </p>

//       {/* Error Display */}
//       {error && (
//         <div className="text-red-500 text-center text-xs mb-6 bg-red-50 p-3 rounded-xl border">
//           {error}
//         </div>
//       )}

//       <div className="space-y-8">
//         {/* OTP Input */}
//         <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//           <InputOTPGroup className="gap-3 justify-center">
//             {[...Array(6)].map((_, i) => (
//               <InputOTPSlot 
//                 key={i} 
//                 index={i} 
//                 className="w-14 h-16 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 ring-emerald-200 shadow-sm"
//               />
//             ))}
//           </InputOTPGroup>
//         </InputOTP>

//         {/* Timer */}
//         <div className="text-center space-y-2">
//           <p className="text-slate-400 text-xs uppercase tracking-widest">Expires in</p>
//           <p className="text-3xl font-bold text-emerald-600">{formatTime(timeLeft)}</p>
//         </div>

//         {/* Verify Button */}
//         <Button
//           onClick={() => onVerify(otp)}
//           disabled={otp.length !== 6 || loading}
//           className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
//         >
//           {loading ? 'Verifying...' : 'Verify & Continue'}
//         </Button>

//         {/* Resend */}
//         <div className="pt-6 border-t border-slate-100">
//           <button
//             onClick={handleResend}
//             disabled={!canResend || loading}
//             className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
//               canResend 
//                 ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" 
//                 : "text-slate-400 bg-slate-50 cursor-not-allowed"
//             }`}
//           >
//             <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//             {loading ? 'Sending...' : 'Resend Code'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }










'use client';

import React, { useState, useEffect, useCallback } from "react";
import { RotateCw, Home } from "lucide-react"; // Replaced Check with Home
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from 'next/link';

interface OtpFormProps {
  email: string;
  loading: boolean;
  error: string | null;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export default function OtpForm({ 
  email, 
  loading, 
  error, 
  onVerify, 
  onResend 
}: OtpFormProps) {
  
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer logic - KEPT EXACTLY AS IS
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = useCallback(() => {
    setTimeLeft(60);
    setCanResend(false);
    setOtp("");
    onResend();
  }, [onResend]);

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-10">
      
      {/* Brand Logo - Matched to your LoginForm */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-100">
          <Home className="w-7 h-7 text-white stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Account</h1>
        {/* <p className="text-slate-500 text-sm leading-relaxed">
          Enter the 6-digit code we sent to <br />
          <span className="font-semibold text-slate-900">{email || 'your email'}</span>
        </p>
         */}

         <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
          We've sent a verification code to your email address. Please enter the 6-digit code below to continue.
        </p>
        {/* Error Display */}
        {error && (
          <p className="text-red-500 mt-4 text-xs bg-red-50 p-2 rounded-lg border border-red-100 w-full text-center">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {/* OTP Input - Improved sizing/spacing */}
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="gap-2 sm:gap-3">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot 
                  key={i} 
                  index={i} 
                  className="w-10 h-14 sm:w-12 sm:h-16 text-xl font-bold rounded-xl border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Timer UI */}
        <div className="text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Code expires in</p>
          <p className="text-2xl font-mono font-bold text-emerald-600">{formatTime(timeLeft)}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => onVerify(otp)}
            disabled={otp.length !== 6 || loading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-md font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all flex gap-2"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
              canResend 
                ? "text-emerald-600 hover:bg-emerald-50" 
                : "text-slate-300 cursor-not-allowed"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${loading && canResend ? 'animate-spin' : ''}`} />
            {loading && canResend ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        {/* Footer Link */}
        {/* <div className="text-center pt-2 border-t border-slate-50">
          <p className="text-sm text-slate-500">
            Back to{' '}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}
