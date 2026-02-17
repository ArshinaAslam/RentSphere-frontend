

import RouteGuard from "@/providers/routerGuard";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
      <RouteGuard allowedRoles={['ADMIN']} loginPath="/admin/login">
        {children}
      </RouteGuard>
    );
}

