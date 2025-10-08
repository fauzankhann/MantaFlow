import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Shared user storage - same as in signup/signin routes
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
  password: 'demo123', // Simple password for demo
  createdAt: new Date().toISOString(),
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          console.log('NextAuth authorize attempt for:', credentials.email)
          console.log('Total users in global storage:', global.users?.length || 0)

          // Check demo user first
          if (credentials.email === demoUser.email) {
            console.log('Checking demo user credentials')
            console.log('Demo user email match:', credentials.email === demoUser.email)
            console.log('Password provided:', credentials.password)
            console.log('Expected password:', demoUser.password)
            
            if (credentials.password === demoUser.password) {
              console.log('Demo user authenticated successfully!')
              return {
                id: demoUser.id,
                email: demoUser.email,
                name: demoUser.name,
                image: null,
              }
            } else {
              console.log('Demo user password mismatch')
              return null
            }
          } else {
          // Find user in global storage
          const user = global.users?.find(u => u.email === credentials.email)
          if (!user) {
            console.log('User not found in NextAuth:', credentials.email)
            return null
          }

          console.log('User found in NextAuth, verifying password for:', user.email)

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          if (!isValidPassword) {
            console.log('Invalid password in NextAuth for:', credentials.email)
            return null
          }

          console.log('User authenticated successfully in NextAuth:', user.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: null,
          }
          }
        } catch (error) {
          console.error('NextAuth authorize error:', error)
          return null
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
