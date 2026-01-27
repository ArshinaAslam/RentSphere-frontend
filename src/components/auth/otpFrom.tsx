// 'use client';

// import React, { useState, useEffect } from "react";
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

// export default function OtpForm({ email, loading, error, onVerify, onResend }: OtpFormProps) {
//   const [otp, setOtp] = useState("");
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   return (
//     <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10 flex flex-col items-center">
//       <div className="mb-6">
//         <div className="w-12 h-12 bg-[#00A86B] rounded-full flex items-center justify-center">
//           <Check className="w-6 h-6 text-white" strokeWidth={3} />
//         </div>
//       </div>
//       <h1 className="text-xl font-bold text-gray-800 mb-2">Verify Your Account</h1>
//       <p className="text-gray-400 text-center text-[0.75rem] leading-relaxed mb-10 max-w-[260px]">
//         Sent to {email}. Enter the 6-digit code below.
//       </p>

//       {error && <div className="w-full text-red-500 text-center text-xs mb-6 bg-red-50 p-3 rounded-xl border border-red-200">{error}</div>}

//       <div className="w-full space-y-8 flex flex-col items-center">
//         <InputOTP maxLength={6} value={otp} onChange={setOtp}>
//           <InputOTPGroup className="gap-2">
//             {[...Array(6)].map((_, i) => (
//               <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg rounded-lg border-gray-100 bg-[#F9FAFB]" />
//             ))}
//           </InputOTPGroup>
//         </InputOTP>

//         <Button 
//           onClick={() => onVerify(otp)} 
//           disabled={otp.length !== 6 || loading}
//           className="w-full h-12 bg-[#00A86B] text-white rounded-lg"
//         >
//           {loading ? 'Verifying...' : 'Verify Code'}
//         </Button>

//         <button 
//           onClick={() => { setTimeLeft(60); setCanResend(false); onResend(); }} 
//           disabled={!canResend || loading}
//           className="text-[#00A86B] text-[0.7rem] font-bold"
//         >
//           <RotateCw className="w-3 h-3 inline mr-1" /> Resend Code ({timeLeft}s)
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Check, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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

  // Timer logic
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
    <div className="bg-white rounded-[2rem] shadow-2xl p-8">
      {/* Header */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Verify Account</h1>
      <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
        We've sent a code to <br />
        <span className="font-semibold text-slate-900">{email || 'your email'}</span>
      </p>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-center text-xs mb-6 bg-red-50 p-3 rounded-xl border">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* OTP Input */}
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="gap-3 justify-center">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot 
                key={i} 
                index={i} 
                className="w-14 h-16 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 ring-emerald-200 shadow-sm"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Timer */}
        <div className="text-center space-y-2">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Expires in</p>
          <p className="text-3xl font-bold text-emerald-600">{formatTime(timeLeft)}</p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => onVerify(otp)}
          disabled={otp.length !== 6 || loading}
          className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>

        {/* Resend */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
              canResend 
                ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" 
                : "text-slate-400 bg-slate-50 cursor-not-allowed"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
