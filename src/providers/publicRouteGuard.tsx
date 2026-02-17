
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function PublicRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData } = useAppSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (userData) {
      const rolePath = userData.role.toLowerCase();
      router.replace(`/${rolePath}/dashboard`);
      return;
    }

    setChecked(true);
  }, [userData, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}