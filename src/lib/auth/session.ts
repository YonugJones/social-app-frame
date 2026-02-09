// Purpose: On a server-rendered request (RSC/page/layout),
// read the incoming request headers/cookies and ask Better Auth for the session.

import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}
