import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to create an order' },
        { status: 401 }
      )
    }

    const { title, description, videoUrl, serviceId } = await request.json()

    // Validate required fields
    if (!title || !description || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        title,
        description,
        videoUrl,
        status: 'PENDING',
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 