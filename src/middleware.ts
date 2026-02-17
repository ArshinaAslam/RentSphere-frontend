// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   console.log("middleware running.....");
//   const accessToken = request.cookies.get('accessToken')?.value;
//   const pathname = request.nextUrl.pathname;
//   console.log(pathname,"pathname")
  
//   const isProtected = [
//     '/tenant/dashboard',
//     '/tenant/profile', 
//     '/landlord/dashboard',
//     '/landlord/profile',
//     // '/admin/dashboard',    
//     // '/admin/users'         
//   ].some(route => pathname.startsWith(route));

//   // const isPublic = [
//   //   '/tenant/login',
//   //   '/landlord/login',
//   //   '/admin/login'
//   // ]

   
 
  
 



//   if (isProtected && !accessToken) {
  
//     // if (pathname.startsWith('/admin')) {
//     //   return NextResponse.redirect(new URL('/admin/login', request.url));
//     // }
//     // Tenant/Landlord redirects
//     console.log("Admin checkj");
//     return NextResponse.redirect(new URL(
//       pathname.includes('tenant') ? '/tenant/login' : '/landlord/login', 
//       request.url
//     ));
//   }
// console.log("middleware again running.....")
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/tenant/:path*',      
//     '/landlord/:path*',   
//     // '/admin/:path*'        
//   ]
// };



// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    
    const decoded = JSON.parse(atob(payload)) as { role?: string; exp?: number };

   
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

    return decoded.role ?? null;
  } catch {
    return null;
  }
}



const PROTECTED_ROUTES = {
  tenant:   ['/tenant/dashboard',   '/tenant/profile'],
  landlord: ['/landlord/dashboard', '/landlord/profile'],
  admin:    ['/admin/dashboard',    '/admin/users'],
};

const AUTH_ROUTES = [
  '/',
  '/tenant/login',
  '/tenant/signup',
  '/landlord/login',
  '/landlord/signup',
  '/admin/login',
  '/verify-otp',
  '/login',
];

function matchesRoutes(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("pathname",pathname)

  const accessToken = request.cookies.get('accessToken')?.value;

 
  const userRole = accessToken ? getRoleFromToken(accessToken) : null;
  console.log("userrole is:",userRole)

  const isTenantProtected   = matchesRoutes(pathname, PROTECTED_ROUTES.tenant);
  const isLandlordProtected = matchesRoutes(pathname, PROTECTED_ROUTES.landlord);
  const isAdminProtected    = matchesRoutes(pathname, PROTECTED_ROUTES.admin);
  const isProtected         = isTenantProtected || isLandlordProtected || isAdminProtected;
  const isAuthRoute         = matchesRoutes(pathname, AUTH_ROUTES);

 
  if (accessToken && userRole && isAuthRoute) {
    
    const redirectMap: Record<string, string> = {
      landlord: '/landlord/dashboard',
      admin:    '/admin/dashboard',
      tenant:   '/tenant/dashboard',
    };
    const redirectTo = redirectMap[userRole] ?? '/tenant/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  
  if (!accessToken && isProtected) {
    console.log("working")
    const loginPath = isAdminProtected
      ? '/admin/login'
      : isTenantProtected
        ? '/tenant/login'
        : '/landlord/login';

    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

 
  if (accessToken && isAdminProtected && userRole !== 'admin') {
    const redirectTo = userRole === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (accessToken && isTenantProtected && userRole !== 'tenant') {
    const redirectTo = userRole === 'admin' ? '/admin/dashboard' : '/landlord/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (accessToken && isLandlordProtected && userRole !== 'landlord') {
    const redirectTo = userRole === 'admin' ? '/admin/dashboard' : '/tenant/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tenant/:path*',
    '/landlord/:path*',
    '/admin/:path*',
  ],
};