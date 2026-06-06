import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { loginSchema } from "@/lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailInput = String(credentials.email).toLowerCase();
        const passwordInput = String(credentials.password);

        // 🛠️ 1. MASTER ADMIN ACCOUNT SEED BYPASS
        if (emailInput === "admin@store.com" && passwordInput === "admin123") {
          return {
            id: "a0000000-0000-0000-0000-000000000001",
            email: "admin@store.com",
            name: "Master Admin",
            role: "admin" // 👈 Explicitly inject the admin role flag
          };
        }

        // 2. Regular User Credentials Validation
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log("Auth Schema Validation Failed:", parsed.error.format());
          return null;
        }

        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, emailInput))
            .limit(1);

          if (!user || !user.passwordHash) return null;

          const valid = await compare(passwordInput, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "user" // Default regular customer role
          };
        } catch (dbError) {
          console.error("Auth database sync error:", dbError);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 🚀 CRITICAL FIX: Pass the role property from authorize into the JWT Token
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; 
      }
      return token;
    },
    // 🚀 CRITICAL FIX: Pass the role from the JWT Token into the active Browser Session
    session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role; // 👈 Now accessible by client and admin layouts!
      }
      return session;
    },
  },
});