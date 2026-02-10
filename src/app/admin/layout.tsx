import AuthClientWrapper from "@/components/ui/AuthClientWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
     <AuthClientWrapper>
                   
                  {children}
                  
            </AuthClientWrapper>
  )
}

