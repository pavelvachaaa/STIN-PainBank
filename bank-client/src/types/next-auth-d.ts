import { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: DefaultUser & { id: string; role: string, accessToken: string };
    }
    interface User extends DefaultUser {
        id: string;
        role: string;
        accessToken: string
    }
}