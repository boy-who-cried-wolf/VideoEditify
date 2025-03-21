import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSignedUploadUrl } from '@/lib/storage'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { filename, contentType, orderId, type } = await request.json()

    if (!filename || !contentType || !orderId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate that the user has access to this order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        userId: true,
        freelancerId: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get the user
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

    // Check if user has permission to upload to this order
    const hasPermission = order.userId === user.id || order.freelancerId === user.id
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Generate a unique key for the file
    const key = `${orderId}/${type}/${Date.now()}-${filename}`

    // Get signed URL for upload
    const uploadUrl = await getSignedUploadUrl(key, contentType)

    // Create file record in database
    const fileUpload = await prisma.fileUpload.create({
      data: {
        filename,
        key,
        size: 0, // Will be updated after upload
        mimeType: contentType,
        orderId,
        ...(type === 'source' ? { sourceOrder: { connect: { id: orderId } } } : {}),
        ...(type === 'delivery' ? { deliveryOrder: { connect: { id: orderId } } } : {}),
      },
    })

    return NextResponse.json({
      uploadUrl,
      fileId: fileUpload.id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 