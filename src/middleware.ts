import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("middleware running.....");
  const accessToken = request.cookies.get('accessToken')?.value;
  const pathname = request.nextUrl.pathname;
  console.log(pathname,"pathname")
  
  const isProtected = [
    '/tenant/dashboard',
    '/tenant/profile', 
    '/landlord/dashboard',
    '/landlord/profile',
    // '/admin/dashboard',    
    // '/admin/users'         
  ].some(route => pathname.startsWith(route));
  if (isProtected && !accessToken) {
  
    // if (pathname.startsWith('/admin')) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
    // Tenant/Landlord redirects
    console.log("Admin checkj");
    return NextResponse.redirect(new URL(
      pathname.includes('tenant') ? '/tenant/login' : '/landlord/login', 
      request.url
    ));
  }
console.log("middleware again running.....")
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tenant/:path*',      
    '/landlord/:path*',   
    // '/admin/:path*'        
  ]
};
