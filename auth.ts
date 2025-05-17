import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { db } from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import toast from "react-hot-toast";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  cookies: {
    // sessionToken: {
    //   name: `next-auth.session-token`,
    //   // options: {
    //   //   httpOnly: true,
    //   //   sameSite: "lax",
    //   //   path: "/",
    //   //   secure: process.env.NODE_ENV === "production",
    //   // },
    // },
    // callbackUrl: {
    //   name: `next-auth.callback-url`,
    //   // options: {
    //   //   sameSite: "lax",
    //   //   path: "/",
    //   //   secure: process.env.NODE_ENV === "production",
    //   // },
    // },
    // csrfToken: {
    //   name: `next-auth.csrf-token`,
    //   // options: {
    //   //   httpOnly: true,
    //   //   sameSite: "lax",
    //   //   path: "/",
    //   //   secure: process.env.NODE_ENV === "production",
    //   // },
    // },
  },
  pages: {
    signIn: "/login",
    signOut: "/login", // Redirect after sign out
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {},
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist and are strings
          if (
            !credentials ||
            typeof credentials.email !== "string" ||
            typeof credentials.password !== "string"
          ) {
            toast.error("Invalid credentials format");
            return null;
          }

          // Check if user exists
          const user = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            toast.error("Invalid email or password");
            return null;
          }

          // Check if user has password (not OAuth-only user)
          if (!user.hashedPassword) {
            toast.error("Please use your social login provider");
            return null;
          }

          // Verify password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordCorrect) {
            toast.error("Invalid email or password");
            return null;
          }

          // Return user object without sensitive data
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          toast.error("Authorization error");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const userAlreadyExist = await db.user.count({
        where: {
          email: {
            equals: user?.email,
            mode: "insensitive",
          },
        },
      });

      if (!userAlreadyExist) {
        await db.user.create({
          data: {
            email: user?.email,
            name: user?.name,
            image: user?.image,
            emailVerified: new Date(),
          },
        });
      }
      return true;
    },
    async session({ token, session }) {
      if (token) {
        session!.user!.id = token.id;
        session!.user!.name = token.name;
        session!.user!.email = token.email!;
        session!.user!.image = token.picture;
        session!.user!.role = token.role;
      }
      const modifiedSession = {
        ...session,
        user: token as JWT,
      };

      return modifiedSession;
    },
    async jwt({ token, user }): Promise<JWT> {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!dbUser) {
        if (user?.id) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },
  },
});
