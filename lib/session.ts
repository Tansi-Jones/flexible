import { SessionInterface, UserProfile } from "@/common.types";
import jsonwebtoken from "jsonwebtoken";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import GoogleProviders from "next-auth/providers/google";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProviders({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          issuer: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
      return decodedToken;
    },
  },

  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },

  callbacks: {
    async session({ session }) {
      const email = session.user?.email as string;

      try {
        const data = (await getUser(email)) as { user?: UserProfile };

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data.user,
          },
        };
        return newSession;
      } catch (error) {
        console.log("Error getting user", error);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const userExist = (await getUser(user?.email as string)) as {
          user: UserProfile;
        };

        if (!userExist.user) {
          await createUser(
            user?.name as string,
            user?.email as string,
            user?.image as string
          );
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;

  return session;
}
