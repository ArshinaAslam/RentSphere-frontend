'use client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import PublicRouteGuard from '@/providers/publicRouteGuard';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    console.error('MISSING NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local');
  }

  return (
    <PublicRouteGuard>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        {children}
      </GoogleOAuthProvider>
    </PublicRouteGuard>
  );
}