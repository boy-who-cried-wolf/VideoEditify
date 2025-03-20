'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to VideoEditify!</h2>
            <p className="text-gray-600">
              This is your dashboard where you can manage your video editing projects.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 