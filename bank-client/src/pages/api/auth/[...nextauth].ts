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
                
                return {
                    id: res.data?.user.id,
                    name: res.data?.user.name,
                    email: res.data?.user.email,
                    access_token: res.data?.token
                }

            },
        }),
    ],

    callbacks: {
        async session({ session, token, user }: { session: any, token: any, user: any }) {
            session.user.id = token.id;
            session.accessToken! = token.accessToken;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,

};

export default NextAuth(authOptions);