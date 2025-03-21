'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface FreelancerFormData {
  bio: string
  skills: string
  hourlyRate: number
}

export default function FreelancerRegistration() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<FreelancerFormData>({
    bio: '',
    skills: '',
    hourlyRate: 25, // Default hourly rate
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.replace('/auth/signin')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/freelancer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to register as freelancer')
      }

      router.replace('/freelancer/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register as freelancer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    router.replace('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Register as a Freelancer
            </h1>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Professional Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tell us about your experience in video editing..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <div className="mt-1">
                  <textarea
                    id="skills"
                    name="skills"
                    rows={4}
                    required
                    value={formData.skills}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="List your video editing skills and software proficiency..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                  Hourly Rate (USD)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="hourlyRate"
                    id="hourlyRate"
                    required
                    min="1"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Registering...' : 'Register as Freelancer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 