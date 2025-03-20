import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to claim orders' },
        { status: 401 }
      )
    }

    // Get the freelancer
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })

    if (!user || user.role !== 'FREELANCER') {
      return NextResponse.json(
        { error: 'Only freelancers can claim orders' },
        { status: 403 }
      )
    }

    // Get the order and check if it's available
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      select: { status: true, freelancerId: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status !== 'PENDING' || order.freelancerId) {
      return NextResponse.json(
        { error: 'Order is not available for claiming' },
        { status: 400 }
      )
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: 'CLAIMED',
        freelancerId: user.id,
      },
    })

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error('Failed to claim order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 