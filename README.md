# VideoEditify

VideoEditify is an online platform that connects content creators with professional video editors. The platform provides a streamlined process for ordering custom video editing services with various options like sound design and motion design.

## Features

- Order & Customization (Select options, upload files, price estimation)
- Integrated Stripe Payment (No redirection, payment on-site)
- User Dashboard (Order history, order tracking)
- Freelancer Dashboard (List of available orders, claim jobs)
- Review & Rating System
- Full English Website
- Legal Compliance (Terms of Service, Privacy Policy, GDPR compliance)

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, PostgreSQL with Prisma
- **Authentication**: Auth.js
- **Payment Processing**: Stripe

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/videoeditify.git
   cd videoeditify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your own values

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 