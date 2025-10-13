import { NextResponse, type NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_COOKIE = 'anonymous-user-id';

export function middleware(request: NextRequest) {
  let userId = request.cookies.get(USER_ID_COOKIE)?.value;

  const response = NextResponse.next();

  if (!userId) {
    userId = uuidv4();
    console.log(`New anonymous user identified: ${userId}`);

    response.cookies.set(USER_ID_COOKIE, userId, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 10,
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
