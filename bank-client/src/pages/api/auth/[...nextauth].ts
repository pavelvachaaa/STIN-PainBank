import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import { AuthenticateDTO, authenticate, } from "@/services/auth.service";
import { HttpCode } from "@/types/interfaces";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: { auth_request_id: {}, code: {} },
            async authorize(credentials, req): Promise<any> {
                const res = await authenticate({ auth_request_id: credentials?.auth_request_id ?? "", code: Number(credentials?.code) });

                if (!res?.data == null) {
                    return null;
                }
                console.log("[res.data]", res.data);
                const data = {
                    id: res.data?.user?.id ?? "",
                    name: res.data?.name ?? "Pavel Vácha",
                    email: res.data?.user.email,
                    accessToken: res.data?.token,
                    image: res.data?.token,
                    role: "ADMIN"
                }
                console.log("[data]", data)
                return data;

            },
        }),
    ],
    callbacks: {
      
        async session({ session, token, user }) {
            if (session?.user) {
                session.user.id = user?.id ?? "";
                session.user.role = (token as any).role
                session.user.accessToken = (token as any).accessToken
            }
            console.log("SESSION JE PRVNI????", session)
            return session;
        },
        async jwt({ token, user }) {
            console.log("A NEBO JWT????", { ...token, ...user })

            return { ...token, ...user };
        },

    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,

};

export default NextAuth(authOptions);