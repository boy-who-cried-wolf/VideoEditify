import NextAuth, { DefaultUser } from "next-auth"
import type { UserRole } from "./order"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: UserRole | null
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserRole | null
    }
  }
} 