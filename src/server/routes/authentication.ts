import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { cookies } from "next/headers";

export const authenticationRouter = createTRPCRouter({
  authenticate: baseProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input }) => {
      const { password } = input;

      // Determine role based on password
      let role: "admin" | "support" | null = null;
      if (password === process.env.ADMIN_PASSWORD) {
        role = "admin";
      } else if (password === process.env.SUPPORT_PASSWORD) {
        role = "support";
      }

      // Check if the password is valid
      if (!role) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      // Set the session cookie with password and role
      (await cookies()).set({
        name: "authenticated",
        value: `${password}&role=${role}`,
      });

      // Return the role
      return { role };
    }),

  isAuthenticated: baseProcedure.query(async ({}) => {
    // Check if the authenticated cookie is set
    const sessionCookie = (await cookies()).get("authenticated");
    if (!sessionCookie) {
      return { authenticated: false, role: null };
    }

    // Parse role from cookie
    const cookieValue = sessionCookie.value;
    const rolePart = cookieValue.split("&role=")[1];
    const role = rolePart as "admin" | "support" | undefined;

    // Return authentication status and role
    return { authenticated: true, role: role || null };
  }),
});
