import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignUpEmail: true,
  },
  plugins: [],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;

/**
 * Get session helper function using better-auth's toNextApiHandler
 * This extracts session information from the request context
 */
export async function getSessionFromRequest(request: Request) {
  try {
    const url = new URL(request.url);
    const response = await auth.api.getSession({
      headers: request.headers,
    });
    return response;
  } catch (error) {
    return null;
  }
}
