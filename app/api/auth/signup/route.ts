import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Shared user storage - simple global variable for development
// In production, this would be a database
declare global {
  var users: Array<{
    id: string
    name: string
    email: string
    password: string
    createdAt: string
  }> | undefined
}

// Initialize global users array if it doesn't exist
if (!global.users) {
  global.users = []
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    console.log('Signup attempt for:', email)
    console.log('Current users in storage:', global.users?.length || 0)

    // Check if user already exists
    const existingUser = global.users?.find(user => user.email === email)
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    // Store user in global storage
    global.users!.push(user)

    console.log('User created:', { id: user.id, name: user.name, email: user.email })
    console.log('Total users after creation:', global.users?.length || 0)

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
