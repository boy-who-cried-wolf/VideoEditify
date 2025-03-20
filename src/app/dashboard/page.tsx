import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { Order } from '@/types/order'

async function getOrders(userEmail: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return orders
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Please sign in to view your dashboard
            </h2>
            <div className="mt-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const orders = await getOrders(session.user.email)

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Your Orders
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              New Order
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {orders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">You haven't placed any orders yet.</p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {orders.map((order: Order) => (
                <li key={order.id}>
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {order.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${
                                order.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }
                            `}>
                              {order.status.charAt(0) + order.status.slice(1).toLowerCase().replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {order.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
} 