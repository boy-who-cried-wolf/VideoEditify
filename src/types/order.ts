export type OrderStatus = 'PENDING' | 'CLAIMED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'REVISION' | 'COMPLETED' | 'CANCELLED'

import type { JsonValue } from '@prisma/client/runtime/library'

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'FREELANCER'

export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  bio?: string | null
  skills?: string[]
  hourlyRate?: number | null
  stripeConnectId?: string | null
  isAvailable: boolean
}

export interface FileUpload {
  id: string
  filename: string
  key: string
  size: number
  mimeType: string
  uploadedAt: Date
  orderId: string
}

export interface Order {
  id: string
  title: string
  description: string
  status: OrderStatus
  price: number
  createdAt: Date
  updatedAt: Date
  userId: string
  freelancerId?: string | null
  user?: User
  options?: JsonValue | null
  requirements?: string | null
  deadline?: Date | null
  stripePaymentIntentId?: string | null
  isPaid: boolean
  sourceFiles?: FileUpload[]
  deliveryFiles?: FileUpload[]
} 