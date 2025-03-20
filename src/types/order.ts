export type OrderStatus = 'PENDING' | 'CLAIMED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'REVISION' | 'COMPLETED' | 'CANCELLED'

export interface User {
  id: string
  name: string | null
  email: string | null
}

export interface Order {
  id: string
  title: string
  description: string
  videoUrl: string
  status: OrderStatus
  price: number
  createdAt: Date
  updatedAt: Date
  userId: string
  freelancerId?: string | null
  user?: User
  options?: Record<string, any> | null
  requirements?: string | null
  deadline?: Date | null
  stripePaymentIntentId?: string | null
  isPaid: boolean
} 