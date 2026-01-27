'use client';

import AuthHeader from '@/components/auth/AuthHeader';
import React from 'react';
import { useAppSelector } from "@/store/hooks";

export default function TenantDashboard() {
  // Access user data to display personalized info
  const { userData } = useAppSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* The component automatically switches to Dashboard mode because 
          it's not an 'isAuthPage' and userData exists */}
      <AuthHeader authAction="login" isAuthPage={false} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {userData?.firstName || 'User'}!
            </h1>
            <p className="text-slate-500">You have completed login successfully.</p>
          </header>

         
        </div>
      </main>
    </div>
  );
}

