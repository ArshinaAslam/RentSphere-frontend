import AuthClientWrapper from "@/components/ui/AuthClientWrapper";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
     <AuthClientWrapper>
                   
                  {children}
                  
            </AuthClientWrapper>
  )
}

