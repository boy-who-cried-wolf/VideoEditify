# 🎬 VideoEditify

[![Live Demo](https://img.shields.io/badge/Live%20Demo-VideoEditify-blue?style=for-the-badge&logo=render)](https://videoeditify.onrender.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

VideoEditify is a modern platform that bridges the gap between content creators and professional video editors. Whether you're a YouTuber, marketer, or content creator, VideoEditify provides a seamless experience for ordering high-quality video editing services.

## ✨ Features

### For Content Creators
- 🎥 **Easy Ordering**: Simple 3-step process to place your order
- ⚡ **Fast Turnaround**: Connect with available editors instantly
- 💰 **Transparent Pricing**: Know the cost before you order
- 📦 **Secure File Upload**: Upload your source files with confidence
- 🔄 **Revision System**: Request changes until you're satisfied
- ⭐ **Quality Assurance**: Review and rate completed work

### For Video Editors
- 🎯 **Job Matching**: Find projects that match your skills
- 💼 **Flexible Work**: Choose projects that fit your schedule
- 💸 **Secure Payments**: Get paid through Stripe Connect
- 📊 **Portfolio Building**: Showcase your work through reviews
- 📱 **Real-time Updates**: Stay informed about order status

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form
- **File Upload**: React Dropzone

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Next-Auth.js
- **Payments**: Stripe
- **Storage**: Cloudflare R2

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL database
- Stripe account
- Cloudflare R2 account (for file storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/boy-who-cried-wolf/VideoEditify.git
   cd VideoEditify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the following variables in `.env`:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A secure random string
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`: From Stripe Dashboard
   - `R2_*`: Your Cloudflare R2 credentials

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

### Project Structure
```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/             # Utility functions and configurations
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

### Key Features Implementation
- **Authentication**: Next-Auth.js with Google and Email providers
- **File Upload**: Secure upload to Cloudflare R2 with presigned URLs
- **Payments**: Stripe integration with webhook handling
- **Real-time Updates**: Server-side events for order status changes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- [@boy-who-cried-wolf](https://github.com/boy-who-cried-wolf)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Stripe](https://stripe.com/) for the payment processing
- [Cloudflare](https://www.cloudflare.com/) for the R2 storage service

---

<div align="center">
  <sub>Built with ❤️ by Rowell</sub>
</div> 