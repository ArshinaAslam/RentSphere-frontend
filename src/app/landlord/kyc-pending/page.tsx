// pages/landlord/KycPending.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const KycPending = () => {
  const router = useRouter();
    const storedKycId = sessionStorage.getItem('kycId');
    const storedEmail = sessionStorage.getItem('userEmail');


  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [submittedAt, setSubmittedAt] = useState('');
  const [message, setMessage] = useState('');

  // ✅ Check KYC status every 10 seconds
  useEffect(() => {

   if (!storedKycId || !storedEmail) {
     
      return;
    }

    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/auth/kyc-status?email=${storedEmail}&kycId=${storedKycId}`);
        const data = response.data.data;
        
        setStatus(data.status);
        setSubmittedAt(new Date(data.submittedAt).toLocaleString());
        setMessage(data.message);
        
        // Auto redirect on approval
        if (data.status === 'APPROVED') {
          setTimeout(() => router.push('/landlord/login'), 2000);
        }
      } catch (error) {
        console.error('Status check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, [storedKycId, storedEmail, router]);

  const handleManualCheck = async () => {
    // Trigger manual status check
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="p-8 text-center border-b border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            {status === 'PENDING' ? (
              <ClockIcon className="w-10 h-10 text-white animate-spin-slow" />
            ) : status === 'APPROVED' ? (
              <CheckCircleIcon className="w-10 h-10 text-white" />
            ) : (
              <ExclamationTriangleIcon className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'PENDING' ? 'KYC Under Review' : 
             status === 'APPROVED' ? 'KYC Approved! 🎉' : 'KYC Rejected'}
          </h1>
          
          <p className="text-gray-600 mb-1">
            {status === 'PENDING' 
              ? 'Your documents are being verified by our team.' 
              : message}
          </p>
          
          <p className="text-sm text-gray-500">
            ID: <span className="font-mono font-medium text-indigo-600">{storedKycId}</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Step 1: Documents Submitted */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Documents Submitted</p>
                <p className="text-sm text-gray-500">{submittedAt}</p>
              </div>
            </div>

            {/* Step 2: Under Review */}
            <div className={`flex items-center space-x-4 ${status !== 'PENDING' ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'PENDING' 
                  ? 'bg-yellow-100 border-2 border-yellow-300' 
                  : status === 'APPROVED' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
              }`}>
                {status === 'PENDING' ? (
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                ) : status === 'APPROVED' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {status === 'PENDING' ? 'Under Review' : 
                   status === 'APPROVED' ? 'Verified' : 'Rejected'}
                </p>
                <p className="text-sm text-gray-500">
                  {status === 'PENDING' 
                    ? 'Usually takes 24-48 hours' 
                    : status === 'APPROVED' 
                      ? 'Identity verified successfully' 
                      : 'Please resubmit documents'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {status === 'PENDING' && (
            <div className="space-y-3">
              <button
                onClick={handleManualCheck}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5" />
                    <span>Check Status</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => router.push('/landlord/kyc')}
                className="w-full bg-white text-indigo-600 py-3 px-4 rounded-xl font-medium border-2 border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Edit Documents
              </button>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className="text-center">
              <button
                onClick={() => router.push('/landlord/login')}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Login →
              </button>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/landlord/kyc')}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
              >
                Resubmit Documents
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact support@yourapp.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default KycPending;
