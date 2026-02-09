
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { fetchKycStatusAsync } from '@/features/kyc/kycThunks';

const KycPendingPage = () => {
  const router = useRouter();
  const { kycId, kycStatus,kycRejectedReason } = useAppSelector((state) => state.kyc);
const dispatch = useAppDispatch()


  useEffect(() => {
  const email = sessionStorage.getItem('signupEmail');
  if (email) {
    dispatch(fetchKycStatusAsync(email));
  }
}, [dispatch]);

  // ✅ Show different UI based on kycStatus
  if (kycStatus === 'APPROVED') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {/* ✅ APPROVED - Green success */}
          <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ KYC Approved!
          </h1>
          
          <p className="text-emerald-700 mb-8 text-sm leading-relaxed">
            Your identity has been verified. You can now login to your landlord dashboard.
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
            <p className="text-emerald-800 text-sm font-medium">
              KYC ID: <code className="bg-emerald-100 px-2 py-1 rounded text-xs font-mono">{kycId}</code>
            </p>
            <p className="text-emerald-800 text-xs mt-1">Status: <span className="font-bold text-emerald-700">APPROVED</span></p>
          </div>

          {/* ✅ LOGIN button only */}
          <Button 
            onClick={() => router.push('/landlord/login')}
            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold"
          >
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  if (kycStatus === 'REJECTED') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {/* ✅ REJECTED - Red warning */}
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            KYC Rejected
          </h1>
          
          <p className="text-red-700 mb-6 text-sm leading-relaxed">
            Please review your documents and resubmit KYC.
          </p>

          

 <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 text-left">
  <p className="text-xs text-red-600 mt-2 font-medium">
              KYC ID: <code className="bg-red-100 px-2 py-1 rounded text-xs font-mono">{kycId}</code>
            </p>
              <p className="text-xs text-red-600 mt-2 font-medium">
              KYC STATUS: <code className="bg-red-100 px-2 py-1 rounded text-xs font-mono">{kycStatus}</code>
            </p>
            <p className="text-red-800 text-sm font-semibold mb-2">Reason for Rejection:</p>
            <p className="text-red-700 text-sm bg-red-100 p-3 rounded-lg">
              {kycRejectedReason || 'Documents unclear or incomplete'}
            </p>
            
          </div>


          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/landlord/kyc-details')}
              className="w-full h-12 bg-red-600 hover:bg-red-700"
            >
              Resubmit KYC
            </Button>
            {/* <Button 
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full h-12"
            >
              Go to Login
            </Button> */}
          </div>
        </div>
      </div>
    );
  }

  // ✅ DEFAULT: PENDING (most common)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* Clock icon */}
        <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-8 flex items-center justify-center">
          <Clock className="w-12 h-12 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          KYC Under Review
        </h1>
        
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Your documents are being verified. You'll be notified within 24 hours.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8">
          <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-emerald-800 text-sm font-medium">
            KYC ID: <code className="bg-emerald-100 px-2 py-1 rounded text-xs font-mono">{kycId}</code>
          </p>
          <p className="text-emerald-800 text-xs mt-1">
            Status: <span className="font-bold text-yellow-700">{kycStatus}</span>
          </p>
        </div>

        <div className="space-y-3">
          {/* <Button 
            onClick={() => router.push('/login')}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            Go to Login
          </Button> */}
          {/* <Link 
            href="/landlord/dashboard"
            className="block w-full text-center text-gray-500 hover:text-gray-700 text-sm font-medium underline underline-offset-2 py-2"
          >
            Check Dashboard Later
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default KycPendingPage;
