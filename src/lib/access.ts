import { NextRequest, NextResponse } from 'next/server';

export const ACCESS_COOKIE = 'portfolio-access';

export function getAccessCode(): string | undefined {
  const code = process.env.ACCESS_CODE;
  if (code == null || code === '') return undefined;
  return code;
}

/** When ACCESS_CODE is unset, access checks are skipped (local/dev convenience). */
export function isAccessConfigured(): boolean {
  return getAccessCode() != null;
}

export function hasValidAccess(request: NextRequest): boolean {
  const expected = getAccessCode();
  if (expected == null) return true;
  return request.cookies.get(ACCESS_COOKIE)?.value === expected;
}

export function unauthorizedAccessResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Access code required. Unlock the ideation page first.' },
    { status: 401 }
  );
}
