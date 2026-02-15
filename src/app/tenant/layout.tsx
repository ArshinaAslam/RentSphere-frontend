import AuthClientWrapper from "@/components/ui/AuthClientWrapper";


export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
     <AuthClientWrapper>
                   
                  {children}
                  
            </AuthClientWrapper>
  )
}


