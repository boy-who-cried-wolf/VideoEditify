import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to register as a freelancer' },
        { status: 401 }
      )
    }

    const { bio, skills, hourlyRate } = await request.json()

    // Validate required fields
    if (!bio || !skills || !hourlyRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user is already a freelancer
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (existingUser?.role === 'FREELANCER') {
      return NextResponse.json(
        { error: 'User is already registered as a freelancer' },
        { status: 400 }
      )
    }

    // Update user to become a freelancer
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        role: 'FREELANCER',
        bio,
        skills,
        hourlyRate,
        isAvailable: true,
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error('Failed to register freelancer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 