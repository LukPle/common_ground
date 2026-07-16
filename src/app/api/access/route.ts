import {
  ACCESS_COOKIE,
  getAccessCode,
  hasValidAccess,
  isAccessConfigured,
} from '@/lib/access';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (!isAccessConfigured()) {
    return NextResponse.json({ unlocked: true, required: false });
  }

  return NextResponse.json({
    unlocked: hasValidAccess(request),
    required: true,
  });
}

export async function POST(request: NextRequest) {
  const expected = getAccessCode();

  if (expected == null) {
    return NextResponse.json({ unlocked: true, required: false });
  }

  let body: { code?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (code.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(code)) {
    return NextResponse.json(
      { error: 'Enter a 6 character code (letters or digits).' },
      { status: 400 }
    );
  }

  if (code !== expected) {
    return NextResponse.json({ error: 'Incorrect access code.' }, { status: 401 });
  }

  const response = NextResponse.json({ unlocked: true });
  response.cookies.set(ACCESS_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
