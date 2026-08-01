import { Plan, Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      plan: Plan;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: Role;
    plan: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    plan: Plan;
  }
}
