import "./globals.css";
import AuthClientWrapper from "@/components/ui/AuthClientWrapper";
import ReduxProvider from "@/providers/ReduxProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased font-sans">
        <ReduxProvider>
          <GoogleOAuthProvider 
            clientId={process.env.GOOGLE_CLIENT_ID!}
          >
            <AuthClientWrapper>
              {children}
            </AuthClientWrapper>
          </GoogleOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
