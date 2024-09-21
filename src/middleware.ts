import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'



export async function middleware(request: NextRequest) {
    const token =await getToken({req:request})
    const url = request.nextUrl

    if(token && (url.basePath.startsWith('/sign-in') || url.basePath.startsWith('/sign-up') || url.basePath.startsWith('/verify') )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher:[ '/sign-in','/sign-up','/','/dashboard/:path*','/verify/:path*']
}