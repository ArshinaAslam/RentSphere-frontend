

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('TENANT' | 'LANDLORD' | 'ADMIN')[];
  loginPath: string;
}

export default function RouteGuard({ children, allowedRoles, loginPath }: RouteGuardProps) {
  const router = useRouter();
  const { userData } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!userData) {
      router.replace(loginPath);
      return;
    }

    if (!allowedRoles.includes(userData.role)) {
      const rolePath = userData.role.toLowerCase();
      router.replace(`/${rolePath}/dashboard`);
      return;
    }

    setIsAuthorized(true);
  }, [userData, allowedRoles, loginPath, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}