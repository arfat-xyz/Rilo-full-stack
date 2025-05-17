import { Role } from "@prisma/client";
import { User } from "next-auth";

type UserId = string;
type UserEmail = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: Role;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      role: Role;
      email: UserEmail;
    };
  }
}
