export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  title: string
  description: string
  videoUrl: string
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  userId: string
} 