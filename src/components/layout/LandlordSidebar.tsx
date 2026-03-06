
// components/ui/LandlordSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { 
  LayoutDashboard, 
  Plus, 
  Home,
  CreditCard, 
  CalendarCheck,
  MessageSquare
} from 'lucide-react';

export default function LandlordSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/landlord/dashboard', icon: LayoutDashboard },
    // { name: 'Add Property', href: '/landlord/add-properties', icon: Plus },
    { name: 'Visit Requests',  href: '/landlord/visit-requests',  icon: CalendarCheck   },
    { name: 'My Properties', href: '/landlord/my-properties', icon: Home },
    { name: 'Enquiries',      href: '/landlord/enquiries',      icon: MessageSquare   },
    { name: 'Payments', href: '/landlord/payments', icon: CreditCard },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-slate-200 p-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive(item.href)
                ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
