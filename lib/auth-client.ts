import { auth } from "./auth";

/**
 * Get the current user session on the server side
 * This should only be called from Server Components or Server Actions
 */

import { customSessionClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [customSessionClient<typeof auth>()],
});


// export async function getSession() {
//   try {
//     const cookieStore = await cookies();
//     const headersList = await headers();
    
//     // Get the session cookie
//     const sessionCookie = cookieStore.get(auth.sessionCookieName || "auth.js");
    
//     if (!sessionCookie) {
//       return null;
//     }

//     // Call the better-auth getSession method
//     const session = await auth.api.getSession({
//       headers: headersList,
//     });

//     return session;
//   } catch (error) {
//     console.error("[v0] Error getting session:", error);
//     return null;
//   }
// }
