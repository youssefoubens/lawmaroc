import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/cases', '/appointments']
  
  // Admin routes that require admin role
  const adminRoutes = ['/admin']
  
  // Advocate routes that require advocate role
  const advocateRoutes = ['/advocate']

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  const isAdvocateRoute = advocateRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Check role-based access
  if (session && (isAdminRoute || isAdvocateRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isAdvocateRoute && profile?.role !== 'advocate') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && req.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}