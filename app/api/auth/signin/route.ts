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

// Demo user for testing
const demoUser = {
  id: 'demo-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJgusgqSK', // demo123
  createdAt: new Date().toISOString(),
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing email or password' },
        { status: 400 }
      )
    }

    console.log('Signin attempt for:', email)
    console.log('Total users in storage:', global.users?.length || 0)

    // Check demo user first
    if (email === demoUser.email) {
      const isValidPassword = await bcrypt.compare(password, demoUser.password)
      if (isValidPassword) {
        console.log('Demo user authenticated successfully')
        return NextResponse.json({
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
          }
        })
      }
    }

    // Find user in global storage
    const user = global.users?.find(u => u.email === email)
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User found, verifying password for:', user.email)

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log('Invalid password for:', email)
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User authenticated successfully:', user.email)

    // Return user data (without password)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
