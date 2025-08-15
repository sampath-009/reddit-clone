# Reddit Clone - Full Stack Application

A modern, full-stack Reddit clone built with Next.js 14, TypeScript, Tailwind CSS, Clerk Authentication, and Sanity CMS.

## 🏗️ System Architecture

### High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION LAYER                   │
├─────────────────────────────────────────────────────────────────┤
│  User (Browser/Mobile) ←→ HTTP/HTTPS ←→ Frontend              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  • Next.js 14 (React Framework)                                │
│  • TypeScript (Type Safety)                                    │
│  • Tailwind CSS (Utility-first Styling)                        │
│  • shadcn/ui + Radix UI (Component Libraries)                 │
│  • React Hooks (State Management)                              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (BACKEND)                    │
├─────────────────────────────────────────────────────────────────┤
│  • Server Actions & API Routes                                 │
│  • React Hooks for State Management                           │
│  • Business Logic Implementation                               │
│  • Data Validation & Processing                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORTING SERVICES & DB                    │
├─────────────────────────────────────────────────────────────────┤
│  • Clerk Authentication (JWT, Sessions)                        │
│  • Sanity CMS (Content Management)                             │
│  • Database Layer:                                             │
│    - Sanity DB (Production)                                    │
│    - SQLite Dev (Development)                                  │
│    - Prisma ORM (Database Access)                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CORE FEATURES                             │
├─────────────────────────────────────────────────────────────────┤
│  • Communities (Create/Join/Manage)                            │
│  • Posts (Text/Image/Link Support)                             │
│  • Comments & Voting System                                    │
│  • Search & Discovery                                          │
│  • Content Moderation                                          │
│  • Real-time Updates                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

1. **User Request Flow:**
   - User interacts with React components
   - Components trigger Server Actions
   - Server Actions validate and process data
   - Data is persisted to Sanity CMS
   - Real-time updates are sent back to client

2. **Authentication Flow:**
   - Clerk handles user authentication
   - JWT tokens are managed securely
   - Protected routes are enforced via middleware
   - User sessions are maintained

3. **Content Management Flow:**
   - Sanity Studio for content creation
   - Real-time content updates
   - Structured data with custom schemas
   - Image optimization and CDN delivery

4. **Database Operations:**
   - Prisma ORM for type-safe database queries
   - Sanity for content and user data
   - SQLite for local development
   - Optimized queries with proper indexing

## 🚀 Features Implemented

### Core Functionality
- ✅ **User Authentication** - Complete auth system with Clerk
- ✅ **Community Creation** - Create and manage subreddits
- ✅ **Post Creation** - Support for text, image, and link posts
- ✅ **Voting System** - Upvote/downvote posts and comments
- ✅ **Comment System** - Threaded comments with voting
- ✅ **Search Functionality** - Search posts and communities
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Real-time Updates** - Server actions with revalidation

### Advanced Features
- ✅ **Sanity CMS Integration** - Content management system
- ✅ **Server Actions** - Modern Next.js data mutations
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Modern UI Components** - shadcn/ui component library
- ✅ **Database Schema** - Comprehensive data models
- ✅ **Content Moderation** - Report system for posts/comments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **CMS**: Sanity Studio
- **Database**: Sanity (with SQLite for development)
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks + Server Actions

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account (for authentication)
- Sanity account (for CMS)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reddit
npm install
```

### 2. Environment Setup

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 3. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env` file

### 4. Sanity Setup

1. Go to [sanity.io](https://sanity.io) and create an account
2. Create a new project
3. Copy your project ID
4. Add it to your `.env` file

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Access Sanity Studio

Visit [http://localhost:3000/studio](http://localhost:3000/studio) to manage your content.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── page.tsx           # Home page
│   ├── r/[name]/          # Community pages
│   └── studio/            # Sanity Studio
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── Header.tsx         # Navigation header
│   ├── Sidebar.tsx        # Right sidebar
│   ├── CreatePost.tsx     # Post creation form
│   ├── PostFeed.tsx       # Post feed display
│   ├── CreateCommunity.tsx # Community creation
│   └── Search.tsx         # Search functionality
├── lib/                   # Utility functions
│   ├── actions.ts         # Server actions
│   ├── helpers.ts         # Helper functions
│   ├── sanity.ts          # Sanity client
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Common utilities
└── schemas/               # Sanity schemas
    ├── index.ts           # Schema exports
    ├── user.ts            # User schema
    ├── post.ts            # Post schema
    ├── subreddit.ts       # Community schema
    ├── comment.ts         # Comment schema
    ├── vote.ts            # Vote schema
    └── reported.ts        # Report schema
```

## 🗄️ Database Schema

### Core Models

- **User**: Authentication, profile, karma
- **Subreddit**: Communities with members and posts
- **Post**: User content (text, image, link)
- **Comment**: Threaded discussions
- **Vote**: Upvotes and downvotes
- **Reported**: Content moderation

### Relationships

- Users can create posts, comments, and communities
- Posts belong to communities and have authors
- Comments can be nested and belong to posts
- Votes are linked to users and content
- Reports track problematic content

## 🔧 Key Features Breakdown

### Authentication System
- Clerk integration for secure user management
- Protected routes and middleware
- User profiles and sessions

### Content Management
- Sanity Studio for content management
- Real-time content updates
- Image and link support

### Community Features
- Create and join communities
- Community-specific posts
- Member management

### Interaction System
- Upvote/downvote posts and comments
- Comment threading
- Content reporting

### Search & Discovery
- Full-text search across posts and communities
- Real-time search results
- Community discovery

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update your environment variables with production values:
- Use production Sanity dataset
- Set proper Clerk production keys
- Configure proper URLs

## 🔒 Security Features

- Clerk authentication with JWT
- Protected API routes
- Input validation and sanitization
- Content moderation system
- Rate limiting (implement as needed)

## 🎨 Customization

### Styling
- Tailwind CSS for easy customization
- CSS variables for theming
- Responsive design patterns

### Components
- shadcn/ui components for consistency
- Radix UI primitives for accessibility
- Custom component library

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interactions
- Mobile-optimized navigation
- Progressive Web App ready

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Advanced search filters
- [ ] User karma system
- [ ] Content moderation tools
- [ ] Image upload functionality
- [ ] Community rules and guidelines
- [ ] User blocking and muting
- [ ] Advanced analytics
- [ ] API endpoints for external use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Reddit's design and functionality
- Uses open-source components and libraries
- Community-driven development approach

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Review the setup instructions
3. Ensure all environment variables are set
4. Check browser console for errors
5. Verify Sanity and Clerk configurations

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
