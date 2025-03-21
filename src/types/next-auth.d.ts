import NextAuth, { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: 'USER' | 'FREELANCER' | 'ADMIN' | null
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'USER' | 'FREELANCER' | 'ADMIN' | null
    }
  }
} 