// Purpose: From a React client component (register/login forms),
// call Better Auth endpoints without manually fetch()ing.

import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
})
