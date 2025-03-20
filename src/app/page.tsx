import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="max-w-5xl w-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Welcome to{' '}
          <span className="text-primary-600">
            VideoEditify
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Professional video editing services for content creators, YouTubers, streamers, and businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/order"
            className="btn-primary text-base px-8 py-3"
          >
            Start Your Order
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  )
} 