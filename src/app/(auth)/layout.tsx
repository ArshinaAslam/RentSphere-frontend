'use client'
import { GoogleOAuthProvider } from '@react-oauth/google';



export default function authLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) 

{


    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    console.error('MISSING NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local');
  }

  return (
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
           
       
               

              {children}
             
        
          </GoogleOAuthProvider>
  
  );
}
