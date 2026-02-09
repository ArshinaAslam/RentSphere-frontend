import "./globals.css";
import AuthClientWrapper from "@/components/ui/AuthClientWrapper";
import ReduxProvider from "@/providers/ReduxProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "sonner"

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased font-sans">
        <ReduxProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <AuthClientWrapper>
               
              {children}
              <Toaster position="top-right" richColors /> 
            </AuthClientWrapper>
          </GoogleOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
