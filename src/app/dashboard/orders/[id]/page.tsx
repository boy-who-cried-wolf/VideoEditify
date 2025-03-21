"use client"

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import FileList from '@/components/FileList'
import FileUpload from '@/components/FileUpload'

interface OrderDetailsProps {
  params: {
    id: string
  }
}

export default async function OrderDetails({ params }: OrderDetailsProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      freelancer: {
        select: {
          name: true,
          email: true,
        },
      },
      sourceFiles: true,
      deliveryFiles: true,
    },
  })

  if (!order) {
    redirect('/dashboard')
  }

  // Check if user has access to this order
  const hasAccess = order.userId === user.id || order.freelancerId === user.id
  if (!hasAccess) {
    redirect('/dashboard')
  }

  const isFreelancer = user.role === 'FREELANCER' && order.freelancerId === user.id

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {order.title}
              </h1>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase().replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{order.description}</p>
              </div>

              {order.requirements && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Requirements</h2>
                  <p className="text-gray-600">{order.requirements}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Client</h2>
                  <p className="text-gray-600">{order.user.name || order.user.email}</p>
                </div>

                {order.freelancer && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Freelancer</h2>
                    <p className="text-gray-600">{order.freelancer.name || order.freelancer.email}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Price</h2>
                  <p className="text-gray-600">${order.price}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Deadline</h2>
                  <p className="text-gray-600">
                    {new Date(order.deadline!).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <FileList
                  files={order.sourceFiles}
                  title="Source Files"
                  emptyMessage="No source files uploaded yet"
                />

                {isFreelancer && (
                  <div>
                    <FileList
                      files={order.deliveryFiles}
                      title="Delivery Files"
                      emptyMessage="No delivery files uploaded yet"
                      className="mb-4"
                    />
                    <FileUpload
                      orderId={order.id}
                      type="delivery"
                      onUploadComplete={() => {
                        // Refresh the page to show new files
                        window.location.reload()
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 