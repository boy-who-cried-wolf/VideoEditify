import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to{' '}
          <span className="text-primary-600">
            VideoEditify
          </span>
        </h1>
        <p className="text-xl mb-12">
          Professional video editing services for content creators, YouTubers, streamers, and businesses.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/order"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Your Order
          </Link>
          <Link
            href="/services"
            className="bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </main>
  )
} 