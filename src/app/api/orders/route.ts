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

    const { title, description, requirements, deadline, price, sourceFiles } = await request.json()

    // Validate required fields
    if (!title || !description || !deadline || !sourceFiles?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create order with file associations
    const order = await prisma.order.create({
      data: {
        title,
        description,
        requirements,
        deadline: new Date(deadline),
        price: parseFloat(price.toString()),
        userId: user.id,
        sourceFiles: {
          connect: sourceFiles.map((fileId: string) => ({ id: fileId })),
        },
      },
      include: {
        sourceFiles: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 