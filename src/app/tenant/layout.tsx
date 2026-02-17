import RouteGuard from "@/providers/routerGuard";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['TENANT']} loginPath="/tenant/login">
      {children}
    </RouteGuard>
  );
}

