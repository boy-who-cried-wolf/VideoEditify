export interface Freelancer {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio: string | null
  skills: string[]
  hourlyRate: number | null
  receivedReviews: {
    rating: number
  }[]
} 