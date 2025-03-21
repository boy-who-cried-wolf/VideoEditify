import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import type { Freelancer } from '@/types/freelancer'

async function getFreelancers(): Promise<Freelancer[]> {
  return prisma.user.findMany({
    where: {
      role: 'FREELANCER',
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      skills: true,
      hourlyRate: true,
      receivedReviews: {
        select: {
          rating: true,
        },
      },
    },
  })
}

export default async function FreelancersPage() {
  const freelancers = await getFreelancers()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Professional Video Editors
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose from our curated list of professional video editors
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {freelancers.map((freelancer: Freelancer) => {
            // Calculate average rating
            const ratings = freelancer.receivedReviews.map(review => review.rating)
            const averageRating = ratings.length > 0
              ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
              : null

            return (
              <div
                key={freelancer.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:px-6">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={freelancer.image || '/default-avatar.png'}
                        alt={freelancer.name || 'Freelancer'}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium text-gray-900 truncate">
                        {freelancer.name || 'Anonymous Freelancer'}
                      </h2>
                      {averageRating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.round(averageRating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            ({ratings.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-5 sm:p-6">
                  {/* Bio */}
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {freelancer.bio || 'No bio available'}
                  </p>

                  {/* Skills */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Starting from{' '}
                      <span className="font-medium text-gray-900">
                        ${freelancer.hourlyRate}/hour
                      </span>
                    </p>
                  </div>
                </div>

                <div className="px-4 py-4 sm:px-6">
                  <Link
                    href={`/services?freelancer=${freelancer.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Hire Me
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 