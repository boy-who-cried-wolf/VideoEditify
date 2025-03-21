import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Order } from '@/types/order'

type ClaimedOrder = Omit<Order, 'user'> & {
  user: {
    name: string | null
    email: string
  }
}

async function getFreelancerOrders(userEmail: string): Promise<{ availableOrders: Order[], claimedOrders: ClaimedOrder[] } | null> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, role: true },
  })

  if (!user || user.role !== 'FREELANCER') {
    return null
  }

  const [availableOrders, claimedOrders] = await Promise.all([
    // Get available orders (not claimed by any freelancer)
    prisma.order.findMany({
      where: {
        status: 'PENDING',
        freelancerId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    // Get orders claimed by this freelancer
    prisma.order.findMany({
      where: {
        freelancerId: user.id,
        NOT: {
          status: 'COMPLETED',
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ])

  return { availableOrders, claimedOrders }
}

export default async function FreelancerDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const orders = await getFreelancerOrders(session.user.email)
  
  if (!orders) {
    redirect('/freelancer/register')
  }

  const { availableOrders, claimedOrders } = orders

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Active Orders Section */}
          <div>
            <div className="md:flex md:items-center md:justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Your Active Orders
                </h2>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {claimedOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">You haven't claimed any orders yet.</p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {claimedOrders.map((order: ClaimedOrder) => (
                    <li key={order.id}>
                      <Link
                        href={`/freelancer/orders/${order.id}`}
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
                                    order.status === 'IN_PROGRESS'
                                      ? 'bg-blue-100 text-blue-800'
                                      : order.status === 'IN_REVIEW'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                `}>
                                  {order.status.charAt(0) + order.status.slice(1).toLowerCase().replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="text-sm text-gray-500">
                                ${order.price}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {order.description}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Client: {order.user.name || order.user.email}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Available Orders Section */}
          <div>
            <div className="md:flex md:items-center md:justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Available Orders
                </h2>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {availableOrders.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders available at the moment.</p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {availableOrders.map((order: Order) => (
                    <li key={order.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-primary-600">
                              {order.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                              {order.description}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                            <p className="text-sm font-medium text-gray-900">
                              ${order.price}
                            </p>
                            <form action={`/api/freelancer/orders/${order.id}/claim`} method="POST">
                              <button
                                type="submit"
                                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Claim Order
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 