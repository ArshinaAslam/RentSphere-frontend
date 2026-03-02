
// import { 
//   LayoutDashboard, 
//   Home as ResidenceIcon, 
//   CreditCard, 
//   FileText, 
//   Heart, 
//   LifeBuoy, 
//   Files 
// } from 'lucide-react';

// export default function Sidebar() {
//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, active: true },
//     { name: 'My Residence', icon: ResidenceIcon, active: false },
//     { name: 'Lease Details', icon: FileText, active: false },
//     { name: 'Payments', icon: CreditCard, active: false },
//     { name: 'Favourites', icon: Heart, active: false },
//     // { name: 'Support', icon: LifeBuoy, active: false },
//     // { name: 'Documents', icon: Files, active: false },
//   ];

//   return (
//     <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-slate-200 p-4">
//       <div className="space-y-2">
//         {menuItems.map((item) => (
//           <button
//             key={item.name}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
//               item.active 
//                 ? 'bg-emerald-50 text-emerald-700' 
//                 : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//             }`}
//           >
//             {/* Using a strokeWidth of 1.5 to match your updated Navbar icons */}
//             <item.icon size={20} strokeWidth={1.5} />
//             <span className="text-sm">{item.name}</span>
//           </button>
//         ))}
//       </div>
//     </aside>
//   );
// }




import { usePathname, useRouter } from 'next/navigation';

import { 
  LayoutDashboard, 
  Home as ResidenceIcon, 
  CreditCard, 
  FileText, 
  Heart, 
  CalendarCheck,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard',    icon: LayoutDashboard, href: '/tenant/dashboard' },
    { name: 'My Residence', icon: ResidenceIcon,   href: '/tenant/home'      },
    { name: 'My Visits',    icon: CalendarCheck,   href: '/tenant/my-visit'    },
    { name: 'Lease Details',icon: FileText,        href: '/tenant/lease'     },
    { name: 'Payments',     icon: CreditCard,      href: '/tenant/payments'  },
    { name: 'Favourites',   icon: Heart,           href: '/tenant/favourites'},
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-slate-200 p-4">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}