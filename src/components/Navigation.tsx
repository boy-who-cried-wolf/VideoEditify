'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isFreelancer = session?.user?.role === 'FREELANCER'

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              VideoEditify
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Show freelancers list to everyone */}
              <Link
                href="/freelancers"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/freelancers'
                    ? 'text-primary-600 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Freelancers
              </Link>

              {/* Show services to non-freelancers */}
              {!isFreelancer && (
                <Link
                  href="/services"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === '/services'
                      ? 'text-primary-600 border-b-2 border-primary-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Services
                </Link>
              )}

              {session && (
                <>
                  {/* Show different dashboard based on role */}
                  <Link
                    href={isFreelancer ? '/freelancer/dashboard' : '/dashboard'}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      pathname === (isFreelancer ? '/freelancer/dashboard' : '/dashboard')
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dashboard
                  </Link>

                  {/* Show orders to freelancers */}
                  {isFreelancer && (
                    <Link
                      href="/freelancer/orders"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        pathname === '/freelancer/orders'
                          ? 'text-primary-600 border-b-2 border-primary-500'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Available Orders
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 