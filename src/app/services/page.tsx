'use client'

import Link from 'next/link'

const services = [
  {
    id: 'basic',
    name: 'Basic Editing',
    price: 49,
    description: 'Perfect for simple video edits and content creators just starting out.',
    features: [
      'Basic cuts and transitions',
      'Background music',
      'Simple text overlays',
      '1-2 day delivery',
      'Up to 10 minutes of footage',
      '1 revision round'
    ]
  },
  {
    id: 'standard',
    name: 'Professional Package',
    price: 99,
    description: 'Ideal for YouTubers and content creators looking for professional quality.',
    features: [
      'Advanced transitions',
      'Custom sound effects',
      'Motion graphics',
      'Color correction',
      'Up to 20 minutes of footage',
      '2 revision rounds'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Production',
    price: 199,
    description: 'Full-service video production for businesses and professional creators.',
    features: [
      'Advanced motion graphics',
      'Custom animations',
      'Professional color grading',
      'Sound mixing & optimization',
      'Up to 30 minutes of footage',
      'Unlimited revisions'
    ]
  }
]

export default function Services() {
  return (
    <div className="bg-gray-50 flex-1">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Video Editing Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect editing package for your content
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative rounded-2xl border ${
                service.popular
                  ? 'border-primary-600 shadow-xl'
                  : 'border-gray-200 shadow'
              } bg-white p-8 flex flex-col`}
            >
              {service.popular && (
                <div className="absolute -top-4 right-8">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {service.name}
                </h3>
                <p className="mt-4 text-gray-500">{service.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${service.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /video
                  </span>
                </p>

                <ul className="mt-6 space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg
                        className="flex-shrink-0 w-6 h-6 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={`/order?service=${service.id}`}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium ${
                    service.popular
                      ? 'text-white bg-primary-600 hover:bg-primary-700'
                      : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  } transition-colors duration-200`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 