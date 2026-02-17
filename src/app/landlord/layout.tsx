
import RouteGuard from "@/providers/routerGuard";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['LANDLORD']} loginPath="/landlord/login">
      {children}
    </RouteGuard>
  );
}