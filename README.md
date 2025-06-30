# Adlume - AI-Powered Advertising Platform

Adlume is a modern, AI-powered advertising platform that enables users to generate high-quality images, videos, and complete ad campaigns using advanced artificial intelligence. Built with Next.js and featuring a comprehensive dashboard, Adlume makes professional advertising accessible to everyone.

# PROMO CODE - BOLTJUDGES100

## Demo Video
[![Watch the video](https://img.youtube.com/vi/XW4f30NvJbw/maxresdefault.jpg)](https://www.youtube.com/watch?v=XW4f30NvJbw)

## Features

### AI Content Generation
- **Image Generation**: Create stunning images with customizable quality settings (low, medium, high) and various sizes
- **Video Generation**: Generate professional videos with different durations (5s, 8s), resolutions (360p-1080p), and motion settings
- **Audio Generation**: Create custom audio content for your advertisements
- **Audio-Video Merging**: Seamlessly combine audio and video content

### Smart Advertising Tools
- **Video Ads**: Create and manage video advertisement campaigns
- **Mockups**: Generate product mockups for advertising materials
- **Image Editor**: Built-in canvas-based image editing capabilities
- **Asset Management**: Save and organize all your generated content

### Business Features
- **Credit System**: Flexible credit-based pricing model
- **Multiple Packages**: Starter, Professional, and Business tiers
- **Billing Management**: Comprehensive billing and subscription management
- **Usage Analytics**: Dashboard statistics and usage tracking

### User Management
- **Secure Authentication**: Powered by Clerk authentication
- **User Sync**: Automatic user synchronization across the platform
- **Dashboard**: Personalized user dashboard with all tools and assets

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom UI components
- **File Storage**: AWS S3 integration
- **API**: RESTful API with Next.js API routes

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Adlume-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the necessary environment variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"

   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   AWS_S3_BUCKET_NAME="your-s3-bucket-name"

   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Adlume-final/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── pricing/           # Pricing pages
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page components
│   ├── ui/               # Reusable UI components
│   └── video-ads/        # Video advertisement components
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Pricing Structure

### Image Generation Credits
- **Low Quality**: 2-3 credits per image
- **Medium Quality**: 7-10 credits per image  
- **High Quality**: 25-38 credits per image

### Video Generation Credits
- **5-second videos**: 39-104 credits (depending on resolution and motion)
- **8-second videos**: 78-104 credits (depending on resolution and motion)

### Credit Packages
- **Starter**: $9 for 1,000 credits
- **Professional**: $18 for 2,200 credits (Most Popular)
- **Business**: $34 for 4,000 credits

## Usage

1. **Sign Up**: Create an account using the secure Clerk authentication
2. **Choose a Plan**: Select a credit package that fits your needs
3. **Generate Content**: Use the dashboard to create images, videos, and audio
4. **Edit & Customize**: Use the built-in image editor to perfect your content
5. **Save & Organize**: Save your generated assets for future use
6. **Create Campaigns**: Build complete advertising campaigns with your content

## 🔧 API Endpoints

- `POST /api/generate` - Generate images
- `POST /api/generate-video` - Generate videos
- `POST /api/generate-audio` - Generate audio
- `POST /api/merge-audio-video` - Merge audio and video
- `GET /api/saved-assets` - Retrieve saved assets
- `POST /api/save-asset` - Save generated content
- `GET /api/user-credits` - Check user credit balance
- `GET /api/dashboard-stats` - Get dashboard statistics

## 🛠️ Development

### Database Migrations
```bash
npx prisma migrate dev --name your-migration-name
```

### Code Formatting
The project uses Prettier and ESLint for code formatting and linting.

### Building for Production
```bash
npm run build
npm start
```

## License

This project is proprietary software. All rights reserved.


## Support

For technical support or questions about Adlume, please reach out to our support team.

---

Built with ❤️ using Next.js, TypeScript, and AI technology. 
