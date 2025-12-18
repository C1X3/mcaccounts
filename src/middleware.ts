import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AFFILIATE_COOKIE_NAME = 'mccapes_affiliate';
const VISITOR_COOKIE_NAME = 'mccapes_visitor';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const refCode = searchParams.get('ref');
  const existingVisitorCookie = request.cookies.get(VISITOR_COOKIE_NAME);
  
  const baseUrl = request.nextUrl.origin;
  const ipAddress = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') || 
                    'unknown';
  const cleanIpAddress = ipAddress.split(',')[0].trim();
  
  if (refCode) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete('ref');
    
    const response = NextResponse.redirect(cleanUrl);
    
    response.cookies.set(AFFILIATE_COOKIE_NAME, refCode, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    if (!existingVisitorCookie) {
      response.cookies.set(VISITOR_COOKIE_NAME, refCode, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      
      try {
        await fetch(`${baseUrl}/api/site-click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliateCode: refCode,
            ipAddress: cleanIpAddress,
          }),
        });
      } catch (error) {
        console.error('Failed to track site click:', error);
      }
    }
    
    return response;
  }
  
  if (!existingVisitorCookie) {
    const response = NextResponse.next();
    
    response.cookies.set(VISITOR_COOKIE_NAME, 'none', {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    try {
      await fetch(`${baseUrl}/api/site-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateCode: null,
          ipAddress: cleanIpAddress,
        }),
      });
    } catch (error) {
      console.error('Failed to track site click:', error);
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
