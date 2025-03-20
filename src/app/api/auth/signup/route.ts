import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!email || !email.includes('@') || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Invalid input - password should be at least 8 characters.' },
        { status: 422 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 422 }
      )
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
} 